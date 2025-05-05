# E-commerce API with NestJS

This is a production-ready e-commerce API built with **NestJS**, designed to provide a scalable and maintainable solution with features inspired by modern e-commerce platforms like Amazon. The project adheres to **SOLID**, **KISS**, and **DRY** principles, ensuring clean, modular, and efficient code. It includes advanced features such as health checks, distributed tracing, rate limiting, request validation, API versioning, DTOs with validation, caching, robust error handling, and asynchronous queue processing with BullMQ.

## Features

- **Authentication & Authorization**: JWT-based user authentication and role-based access control.
- **Product Management**: CRUD operations for products with stock management.
- **Order Processing**: Order creation, payment integration with Stripe, and state machine for order status transitions.
- **Payments**: Secure payment processing with Stripe, including idempotency for reliability.
- **Wishlists**: User-specific wishlists for saving favorite products.
- **Recommendations**: Basic product recommendations based on user order history.
- **Search**: Full-text product search using Elasticsearch.
- **Order Tracking**: Real-time tracking of order shipments.
- **Customer Support**: Ticket-based support system for user inquiries.
- **Promotions**: Discount code application for orders.
- **API Documentation**: Swagger UI for interactive API exploration.
- **Performance & Reliability**:
  - Caching with Redis for improved performance.
  - Rate limiting to prevent abuse.
  - Distributed tracing with OpenTelemetry for monitoring.
  - Asynchronous processing with BullMQ for order handling.
  - Health checks for service monitoring.
- **Security**: Helmet for HTTP headers, CORS, and cookie parsing.

## Project Structure

The project is organized into modular components following NestJS conventions:

```
ecommerce-api folder structure overview:
src/
├── auth/                   # (or modules/auth) if you prefer grouping by feature
│   ├── controllers/
│   ├── dtos/
│   ├── entities/
│   ├── guards/
│   ├── services/
│   └── auth.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   └── pipes/
├── config/
│   ├── environments/       # env-specific settings (dev, prod, test)
│   │   ├── development.ts
│   │   ├── production.ts
│   │   └── test.ts
│   ├── configuration.ts    # loads & merges env files
│   └── validation.ts       # Joi or class-validator schemas for ENV vars
├── database/
│   ├── migrations/         # database migration scripts
│   ├── seeds/              # seed data
│   ├── ormconfig.ts        # TypeORM or Sequelize config
│   └── models/             # (if you keep your models separate from modules)
├── docs/                   # design docs, API spec (OpenAPI/Swagger), ADRs
│   ├── api-spec.yaml
│   └── architecture.md
├── modules/                # feature modules (if separate from root-level)
│   ├── product/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── entities/
│   │   ├── services/
│   │   └── product.module.ts
│   └── …/
├── scripts/                # one-off or routine scripts (data imports, cleanups)
│   └── import-legacy.ts
├── shared/                 # cross-cutting utilities & clients
│   ├── cache/
│   │   └── redis.service.ts
│   ├── clients/            # external APIs (Stripe, Twilio, etc.)
│   ├── exceptions/         # custom Error classes
│   ├── logger/             # Winston/pino setup
│   └── utils/
│       ├── date.ts
│       ├── email.ts
│       └── validator.ts
├── tests/                  # e2e, integration, unit tests
│   ├── e2e/
│   ├── fixtures/
│   └── unit/
├── types/                  # global TypeScript definitions & interfaces
│   └── custom.d.ts
├── app.module.ts           # root module (Nest) or main app entry
├── main.ts                 # server bootstrap
└── bootstrap.ts            # optional: separate initialization logic

src/
├── config/
├── modules/
│   ├── auth/
│   │   └── dot/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── dot/
│   │   └── interfaces/
│   │   └── schemas/
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   ├── products.controller.ts
│   │   └── dot/
│   │   └── schemas/
│   │   └── interfaces/
│   └── ... (other modules)
├── shared/
│   ├── pipes/
│   ├── strategies/
│   ├── decorators/
│   ├── guards/
│   ├── exceptions/
│   └── filters/
├── app.module.ts
└── main.ts                     # Application entry point
```

## Prerequisites

Ensure the following are installed on your system:

- **Node.js**: v18 or higher
- **MongoDB**: v5 or higher (running locally or via Docker)
- **Redis**: v6 or higher (for caching and BullMQ)
- **Elasticsearch**: v8 or higher (for search functionality)
- **Stripe Account**: For payment processing (API keys required)
- **Docker** (optional): For running MongoDB, Redis, or Elasticsearch

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ecommerce-api
   ```

2. **Dependencies**:
   Run this command to install required packages:
   ```bash
   npm install @nestjs/core @nestjs/common @nestjs/config @nestjs/mongoose @nestjs/jwt @nestjs/passport @nestjs/swagger @nestjs/throttler @nestjs/terminus @nestjs/   cache-manager @nestjs/elasticsearch @nestjs/bullmq @nestjs/websockets nest-winston winston helmet cookie-parser stripe bcrypt class-validator class-transformer mongoose redis bullmq @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-http  @opentelemetry/auto-instrumentations-node @opentelemetry/instrumentation-mongodb  cache-manager-redis-store passport passport-jwt socket.io
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecommerce_db
   JWT_SECRET=your-secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   CORS_ORIGIN=http://localhost:3000
   STRIPE_SECRET_KEY=your-stripe-secret-key
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   SHIPPING_API_KEY=your-shipping-api-key
   ```

5. **Start dependent services** (if not already running):
   - **MongoDB**:
     ```bash
     docker run -d -p 27017:27017 --name mongodb mongo
     ```
   - **Redis**:
     ```bash
     docker run -d -p 6379:6379 --name redis redis
     ```
   - **Elasticsearch**:
     ```bash
     docker run -d -p 9200:9200 -e "discovery.type=single-node" --name elasticsearch elasticsearch:8.8.0
     ```

6. **Run the application**:
   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000/api`.

## API Documentation (Swagger UI)

The API is documented using **Swagger UI**, which provides an interactive interface to explore and test endpoints.

- **Access Swagger UI**: Navigate to `http://localhost:3000/api-docs` after starting the 

## Design Principles

The project is built with the following principles to ensure maintainability and scalability:

- **SOLID**:
  - **Single Responsibility**: Each module/class handles a specific concern (e.g., `OrdersService` for order logic, `PaymentsService` for payments).
  - **Open/Closed**: Services are extensible via dependency injection without modifying existing code.
  - **Liskov Substitution**: Interfaces can be implemented for substitutable types if needed.
  - **Interface Segregation**: Modules import only necessary dependencies (e.g., `OrdersModule` imports specific modules).
  - **Dependency Inversion**: High-level modules depend on abstractions via dependency injection.

- **KISS (Keep It Simple, Stupid)**:
  - Simple logic in methods like `createOrder`, which delegates complex tasks (e.g., payments) to specialized services.
  - Clear state transitions in `transitionOrderState` using a state machine.

- **DRY (Don't Repeat Yourself)**:
  - Global utilities like `HttpExceptionFilter` for error handling and `ValidationPipe` for request validation.
  - Shared caching logic in `OrdersService` to avoid duplication.

## Dependencies

The project uses the following key packages:

```bash
npm install @nestjs/core @nestjs/common @nestjs/config @nestjs/mongoose @nestjs/jwt @nestjs/passport @nestjs/swagger @nestjs/throttler @nestjs/terminus @nestjs/cache-manager @nestjs/elasticsearch @nestjs/bullmq @nestjs/websockets nest-winston winston helmet cookie-parser stripe bcrypt class-validator class-transformer mongoose redis bullmq @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-http @opentelemetry/auto-instrumentations-node @opentelemetry/instrumentation-mongodb cache-manager-redis-store passport passport-jwt socket.io
```

## Running Tests

To run unit and integration tests (if implemented):

```bash
npm run test
```

To run end-to-end tests:

```bash
npm run test:e2e
```

## Deployment

For production deployment:

1. **Set `NODE_ENV=production`** in your environment to enable optimized logging.
2. **Build the project**:
   ```bash
   npm run build
   ```
3. **Run in production**:
   ```bash
   npm run start:prod
   ```
4. **Use a process manager** like PM2 for reliability:
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name ecommerce-api
   ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.