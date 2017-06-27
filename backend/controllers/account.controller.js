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
class AccountController extends BaseController {
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
	 * postProject - функция-контроллер, выполняет обработку запроса о добавлении нового
	 * проекта в БД.
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

		let resp = '';

		new Promise((resolve, reject) => {
			const req = http.request(options, (res) => {
			  this.logger.info(`STATUS: ${res.statusCode}`);
			  this.logger.info(`HEADERS: ${JSON.stringify(res.headers)}`);
			  res.setEncoding('utf8');
			  res.on('data', (chunk) => { resp += chunk; });
				res.on('end', () => { resolve(resp); });
			});
			req.write(data);
			req.end();
		})
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
}

module.exports = new AccountController();
