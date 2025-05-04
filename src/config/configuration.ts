export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: { uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db' },
  jwt: { secret: process.env.JWT_SECRET || 'secret', expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  redis: { host: process.env.REDIS_HOST || 'localhost', port: parseInt(process.env.REDIS_PORT, 10) || 6379 },
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:3000' },
  stripe: { secretKey: process.env.STRIPE_SECRET_KEY },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_KEY,
    secret: process.env.CLOUDINARY_SECRET,
  },
  shipping: { apiKey: process.env.SHIPPING_API_KEY },
});
