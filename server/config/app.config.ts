import * as dotenv from 'dotenv';

/* Classes and Interfaces */
import { logger } from '../config/logger.config';
import { IAppConfig } from '../interfaces/app.config.interface';

const config : IAppConfig = {};

if (process.env.NODE_ENV !== 'production') {
	const pathEnv : string = `${__dirname}/../../../.env`;
	dotenv.config({ path: pathEnv });
	logger.info(`Path to .env file: ${pathEnv}`);
	config.env = 'development';
} else {
	config.env = 'production';
}

//... express
config.express = {
	port : +process.env.PORT || 5000
};

//... database

//... crypto
config.crypto = {
	salt : process.env.CRYPTO_SALT || null,
	secret : process.env.CRYPTO_SECRET || null
};

export { config };
