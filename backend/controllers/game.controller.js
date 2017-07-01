'use strict';

const http = require("http");
const path = require('path');
const scriptName = path.basename(__filename, path.extname(__filename));
const jwt = require('jsonwebtoken');

const config = require('../config/app.config');
const logger = require('../config/logger.config');

const BaseController = require('../lib/base-controller.class');
const AppError = require('../lib/app-error.class');

/**
 * Контроллер редактора.
 *
 * @class ProjectController
 */
class GameController extends BaseController {
	/**
	 * Конструктор. Получение из БД максимального ID.
	 *
	 * @class ProjectController
	 * @constructor
	 */
	constructor () {
		super(scriptName);
	}

	/**
	 * postSignin - функция-контроллер, выполняет получение sid пользователя
	 *
	 * @method
	 *
	 * @param {Request} req - объект запроса
	 * @param {Response} res - объект ответа
	 * @return {void}
	 */
	postSignin (req, res) {
		let message, methodName = 'postSignin';

		let body = req.body;

		const data = `<auth uid=\"${body.uid}\" auth_key=\"${body.auth_key}\"/>`;
		this.logger.info(`${this.constructor.name} - ${methodName}:`, data);

		const options = this.getOption('/auth/', data);
		this.postRequest(data, options)
		.then((data) => {
			const parseString = require('xml2js').parseString;
			parseString(data, (err, result) => {
				this.logger.info(`${this.constructor.name} - ${methodName}:`, JSON.stringify(result));

				if (!result['error']) {
					const expires = 86400; // 60s * 60m * 24h * 1d = 86400s (1 days)
					const token = jwt.sign({
						uid : body.uid,
						auth_key : body.auth_key,
						sid : result['response']['auth_ok'][0]['sid'][0]
					}, config.secret, { expiresIn : expires });

					message = 'Sid was received';
					this.sendSuccessResponse(res, 200, { token : token }, methodName, message);
				} else {
					this.sendErrorResponse(res, new AppError('myNotExist', 400), methodName)
				}
			});
		});
	}

	/**
	 * postInfo - функция-контроллер, выполняет данных о аккаунте пользователя
	 *
	 * @method
	 *
	 * @param {Request} req - объект запроса
	 * @param {Response} res - объект ответа
	 * @return {void}
	 */
	postGetInfo (req, res) {
		let message, methodName = 'postGetInfo';

		let body = req.body;
		let acc = req.user;

		const data = `<get_game_info uid=\"${acc.uid}\" auth_key=\"${acc.auth_key}\" sid=\"${acc.sid}\"/>`;
		this.logger.info(`${this.constructor.name} - ${methodName}:`, data);

		const options = this.getOption('/command/', data);
		this.postRequest(data, options)
		.then((data) => {
			const parseString = require('xml2js').parseString;
			parseString(data, (err, result) => {
				if (!result['error']) {
					const items = result['response']['init_game'][0]['user'][0]['items'][0];
					const buildings = result['response']['init_game'][0]['user'][0]['buildings'][0]['building']
						.map((building) => { return { id : building['$']['id'], type : building['$']['type'] }; });

					const resources = {
						metal 	: items['metal'] ? items['metal'][0] : null,
						crystal : items['crystal'] ? items['crystal'][0] : null,
						cordite : items['cordite'] ? items['cordite'][0] : null,
						fuel 		: items['fuel'] ? items['fuel'][0] : null
					};
					const armory = {
						air_strike 			: items['air_strike'] ? items['air_strike'][0] : null,
						medicaments 		: items['medicaments'] ? items['medicaments'][0] : null,
						gravibomb 			: items['gravibomb'] ? items['gravibomb'][0] : null,
						shields 				: items['shields'] ? items['shields'][0] : null,
						space_mines 		: items['space_mines'] ? items['space_mines'][0] : null,
						repair_drones 	: items['repair_drones'] ? items['repair_drones'][0] : null,
						adaptive_shield : items['adaptive_shield'] ? items['adaptive_shield'][0] : null,
						ecm 						: items['ecm'] ? items['ecm'][0] : null
					};

					let land = null, space = null;
					buildings.map((data) => {
						switch (data['type']) {
							case 'factory': land = data['id']; break;
							case 'space_engineering': space = data['id']; break;
						}
					});

					message = 'Game info was received';
					this.sendSuccessResponse(res, 200, {
						land : land,
						space : space,
						resources : resources,
						armory : armory
					}, methodName, message);
				} else {
					this.sendErrorResponse(res, new AppError('myNotAuth', 401), methodName)
				}
			});
		});
	}

	postGetArmory (req, res) {
		let message, methodName = 'postGetArmory';

		let body = req.body;
		let acc = req.user;

		const armory = body.armory;
		const land = [ 'air_strike', 'medicaments', 'gravibomb', 'shields' ];

		for (let prop in armory) {
			const count = +armory[prop];
			if (count === 0) {
				continue;
			}

			const building = land.indexOf(prop) === -1 ? body.space : body.land;
			const dataStartContract = `<start_contract uid=\"${acc.uid}\" auth_key=\"${acc.auth_key}\" sid=\"${acc.sid}\">` +
				`<building_id>${building}</building_id>` +
				`<type>produce_${prop}</type>` +
				`</start_contract>`;
			this.logger.info(`${this.constructor.name} - ${methodName}:`, dataStartContract);

			const optionsStartContract = this.getOption('/command/', dataStartContract);
			this.postRequest(dataStartContract, optionsStartContract)
			.then((data) => {
				const parseString = require('xml2js').parseString;
				parseString(data, (err, result) => {
					this.logger.info(`${this.constructor.name} - ${methodName}:`, 'Start Contract', JSON.stringify(result));
					const contractId = result['response']['contract_started'][0]['_'];
					const dataCollectContract = `<collect_contract uid=\"${acc.uid}\" auth_key=\"${acc.auth_key}\" sid=\"${acc.sid}\">` +
						`<id>${contractId}</id>` +
						`</collect_contract>`;
					this.logger.info(`${this.constructor.name} - ${methodName}:`, 'Data Contract', dataCollectContract);
					const optionsCollectContract = this.getOption('/command/', dataCollectContract);
					this.postRequest(dataCollectContract, optionsCollectContract)
					.then((data) => {
						this.logger.info(`${this.constructor.name} - ${methodName}:`, 'Collect Contract', data);
						req.body.armory[prop] = (count - 1).toString();
						this.postGetArmory(req, res);
					});
				});
			});
			return;
		}
		this.sendSuccessResponse(res, 200, { }, methodName, message);
	}

	getOption (path, data) {
		return {
		  host : 'game-r02vk.rjgplay.com',
		  port : 80,
		  path : path,
		  method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Content-Length' : Buffer.byteLength(data)
			}
		};
	}

	postRequest (data, options) {
		let resp = '';
		return new Promise((resolve, reject) => {
			const req = http.request(options, (res) => {
				this.logger.info(`DATA: ${data}`);
			  this.logger.info(`STATUS: ${res.statusCode}`);
			  this.logger.info(`HEADERS: ${JSON.stringify(res.headers)}`);
			  res.setEncoding('utf8');
			  res.on('data', (chunk) => { resp += chunk; });
				res.on('end', () => { resolve(resp); });
			});
			req.write(data);
			req.end();
		});
	}
}

module.exports = new GameController();
