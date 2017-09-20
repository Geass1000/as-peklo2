import { logger } from '../config/logger.config';
import * as winston from 'winston';
import * as express from 'express';

export class BaseController {
	public logger : winston.LoggerInstance;

	constructor () {
		this.logger = logger;
	}

	/**
	 * sendSuccessResponse - send success response.
	 *
	 * @method
	 *
	 * @param {express.Response} resp - express response object
	 * @param {number} statusCode - status code
	 * @param {Object} data - any payload
	 * @param {string} methodName - sender method name
	 * @param {string} message - logging message
	 * @return {void}
	 */
	sendSuccessResponse (resp : express.Response, statusCode : number,
											 data : any, methodName : string, message : string) : void {
		this.logger.info(`${this.constructor.name} - ${methodName}:`, `${statusCode} -`, message);
		resp.status(statusCode).json(data);
	}

	/**
	 * sendErrorResponse - send error response.
	 *
	 * @method
	 *
	 * @param {express.Response} resp - express response object
	 * @param {Object} error - any Error object
	 * @param {string} methodName - sender method name
	 * @return {void}
	 */
	sendErrorResponse (resp : express.Response, error : any,
										 methodName : string, message : string) : void {
		const statusCode = error.statusCode ? error.statusCode : 500;
		this.logger.error(`${this.constructor.name} - ${methodName}:`, `${statusCode} -`, message);
		resp.status(statusCode).json({ 'error' : message });
	}
}
