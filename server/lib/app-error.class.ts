import { logger } from '../config/logger.config';

export class AppError extends Error {
	public code : string;
	public statusCode : number;

	constructor (code : string, statusCode : number) {
		super();

		this.name = 'AppError';
		this.code = code;
		this.statusCode = statusCode || 500;
	}
}
