'use strict';

const http = require("http");
const path = require('path');
let scriptName = path.basename(__filename, path.extname(__filename));

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

		const options = {
		  host : 'game-r02vk.rjgplay.com',
		  port : 80,
		  path : '/auth/',
		  method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Content-Length' : Buffer.byteLength(data)
			}
		};

		this.postRequest(data, options)
		.then((data) => {
			const parseString = require('xml2js').parseString;
			parseString(data, (err, result) => {
				this.logger.info(`${this.constructor.name} - ${methodName}:`, JSON.stringify(result));

				if (!result['error']) {
					message = 'Sid was received';
					this.sendSuccessResponse(res, 200, { sid : result['response']['auth_ok'][0]['sid'][0] }, methodName, message);
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
		let message, methodName = 'postInfo';

		let body = req.body;

		const data = `<get_game_info uid=\"${body.uid}\" auth_key=\"${body.auth_key}\" sid=\"${body.sid}\"/>`;
		this.logger.info(`${this.constructor.name} - ${methodName}:`, data);

		const options = {
		  host : 'game-r02vk.rjgplay.com',
		  port : 80,
		  path : '/command/',
		  method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Content-Length' : Buffer.byteLength(data)
			}
		};

		this.postRequest(data, options)
		.then((data) => {
			const parseString = require('xml2js').parseString;
			parseString(data, (err, result) => {
				this.logger.info(`${this.constructor.name} - ${methodName}:`, JSON.stringify(result));
				const items = result['response']['init_game'][0]['user'][0]['items'][0];
				const buildings = result['response']['init_game'][0]['user'][0]['buildings'][0]['building'];
				const resources = {
					metal : items['metal'][0],
					crystal : items['crystal'][0],
					cordite : items['cordite'][0],
					fuel : items['fuel'][0]
				};
				const armory = {
					air_strike : items['air_strike'][0],
					medicaments : items['medicaments'][0],
					gravibomb : items['gravibomb'][0],
					shields : items['shields'][0],
					space_mines : items['space_mines'][0],
					repair_drones : items['repair_drones'][0],
					adaptive_shield : items['adaptive_shield'][0],
					ecm : items['ecm'][0]
				};

				if (!result['error']) {
					message = 'Game info was received';
					this.sendSuccessResponse(res, 200, {
						resources : JSON.stringify(resources),
						armory : JSON.stringify(armory)
					}, methodName, message);
				} else {
					this.sendErrorResponse(res, new AppError('myNotExist', 400), methodName)
				}
			});
		});
	}

	postRequest (data, options) {
		let resp = '';
		return new Promise((resolve, reject) => {
			const req = http.request(options, (res) => {
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
