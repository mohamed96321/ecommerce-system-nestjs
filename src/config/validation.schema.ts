import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  CORS_ORIGIN: Joi.string().uri().required(),
});
