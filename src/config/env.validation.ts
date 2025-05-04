import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  CORS_ORIGIN: Joi.string().uri().default('http://localhost:3000'),
  STRIPE_SECRET_KEY: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_KEY: Joi.string().required(),
  CLOUDINARY_SECRET: Joi.string().required(),
  SHIPPING_API_KEY: Joi.string().required(),
});
