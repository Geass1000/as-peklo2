import * as winston from 'winston';

const tsFormat : () => string = () => new Date().toLocaleString();
export const logger : winston.LoggerInstance = new winston.Logger({
  transports: [
    // colorize the output to the console
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
    })
  ]
});
