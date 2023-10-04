import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { JoiUtil, JoiConfig } from 'src/utils';

interface IAppConfig {
  nodeEnv: string;
  port: number;
  secretKey: string;
  databaseHost: string;
  databasePort: number;
  databaseUsername: string;
  databasePassword: string;
  databaseDb: string;
  databaseDbTest: string;
  databaseLogging: boolean;
}

export default registerAs('my-app-config-namespace', (): IAppConfig => {
  const configs: JoiConfig<IAppConfig> = {
    nodeEnv: {
      value: process.env.NODE_ENV,
      joi: Joi.string()
        .valid('development', 'production', 'test', 'local')
        .required()
        .messages({
          'string.base': 'NODE_ENV must be a string',
          'string.empty': 'NODE_ENV is required',
          'any.required': 'NODE_ENV is required',
          'any.only': 'NODE_ENV must be one of [development, production, test]',
        }),
    },
    port: {
      value: parseInt(process.env.PORT, 10),
      joi: Joi.number().required().messages({
        'number.base': 'PORT must be a number',
        'number.empty': 'PORT is required',
        'any.required': 'PORT is required',
      }),
    },
    secretKey: {
      value: process.env.SECRET_KEY,
      joi: Joi.string().required().messages({
        'string.base': 'SECRET_KEY must be a string',
        'string.empty': 'SECRET_KEY is required',
        'any.required': 'SECRET_KEY is required',
      }),
    },
    databaseHost: {
      value: process.env.DATABASE_HOST,
      joi: Joi.string().required().messages({
        'string.base': 'DATABASE_HOST must be a string',
        'string.empty': 'DATABASE_HOST is required',
        'any.required': 'DATABASE_HOST is required',
      }),
    },
    databasePort: {
      value: parseInt(process.env.DATABASE_PORT, 10),
      joi: Joi.number().required().messages({
        'number.base': 'DATABASE_PORT must be a number',
        'number.empty': 'DATABASE_PORT is required',
        'any.required': 'DATABASE_PORT is required',
      }),
    },
    databaseUsername: {
      value: process.env.DATABASE_USERNAME,
      joi: Joi.string().required().messages({
        'string.base': 'DATABASE_USERNAME must be a string',
        'string.empty': 'DATABASE_USERNAME is required',
        'any.required': 'DATABASE_USERNAME is required',
      }),
    },
    databasePassword: {
      value: process.env.DATABASE_PASSWORD,
      joi: Joi.string().required().messages({
        'string.base': 'DATABASE_PASSWORD must be a string',
        'string.empty': 'DATABASE_PASSWORD is required',
        'any.required': 'DATABASE_PASSWORD is required',
      }),
    },
    databaseDb: {
      value: process.env.DATABASE_DB,
      joi: Joi.string().required().messages({
        'string.base': 'DATABASE_DB must be a string',
        'string.empty': 'DATABASE_DB is required',
        'any.required': 'DATABASE_DB is required',
      }),
    },
    databaseDbTest: {
      value: process.env.DATABASE_DB_TEST,
      joi: Joi.string().required().messages({
        'string.base': 'DATABASE_DB_TEST must be a string',
        'string.empty': 'DATABASE_DB_TEST is required',
        'any.required': 'DATABASE_DB_TEST is required',
      }),
    },
    databaseLogging: {
      value: process.env.DATABASE_LOGGING === 'true',
      joi: Joi.boolean().required().messages({
        'boolean.base': 'DATABASE_LOGGING must be a boolean',
        'boolean.empty': 'DATABASE_LOGGING is required',
        'any.required': 'DATABASE_LOGGING is required',
      }),
    },
  };

  return JoiUtil.validate(configs);
});
