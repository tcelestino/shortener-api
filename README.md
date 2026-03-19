# URL Short API

## Project Structure

```
url-short-api/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root application module
│   ├── app.controller.ts          # Root application controller
│   ├── app.service.ts             # Root application service
│   └── api/                      # Api domain module
│       ├── entities/
│       │   └── short.entity.ts     # Short entity and DTOs
│       ├── repositories/
│       │   └── shorten.repository.ts # Data access layer
│       ├── services/
│       │   └── shorten.service.ts    # Business logic layer
│       ├── controllers/
│       │   └── shorten.controller.ts # API request handling layer
│       └── shorten.module.ts         # Shorten module configuration
├── package.json                      # Project dependencies
├── tsconfig.json                    # TypeScript configuration
├── docker-compose.yml               # Docker compose all services (API + PostgreSQL)
├── docker-compose.dependencies.yml  # Docker compose services (PostgreSQL)
├── Dockerfile                       # Docker container
├── nest-cli.json                   # NestJS CLI configuration
└── README.md                       # Project documentation
```

## Architecture Layers

### 1. **Entity Layer** (`short.entity.ts`)
- Defines the Short interface and Data Transfer Objects (DTOs)
- Contains data structure definitions

### 2. **Repository Layer** (`shorten.repository.ts`)
- Handles data persistence and retrieval
- Manages JSON file operations
- Implements CRUD operations

### 3. **Service Layer** (`shorten.service.ts`)
- Contains business logic
- Validates data and enforces business rules
- Acts as an intermediary between controller and repository

### 4. **Controller Layer** (`shorten.controller.ts`)
- Handles HTTP requests and responses
- Defines API endpoints and routing
- Validates input parameters

## Short Entity

```typescript
interface Short {
  id: string;
  url: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  accessCount?: number;
}
```

## API Endpoints

### General
- `GET /health` - Health check

### Endpoints
- `POST /shorten` - Create a new short url
- `GET /shorten/:id` - Get short by ID
- `GET /shorten/:id/stats` - Get stats
- `PUT /shorten/:id` - Update a short
- `DELETE /shorten/:id` - Delete a short

## Sample API Usage

### Create a short
```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "http://www.google.com"}'
```

### Update a short
```bash
curl -X PUT http://localhost:3000/shorten/1 \
  -H "Content-Type: application/json" \
  -d '{"url": "http://www.google.com"}'
```

### Delete a short
```bash
curl -X DELETE http://localhost:3000/shorten/1
```

### Get a short stats
```bash
curl -X GET http://localhost:3000/shorten/1/stats \
```

## Installation and Setup

Copy the environment file and adjust the values if needed:
```bash
cp .env.example .env
```

### Local

1. Install dependencies:
```bash
npm install
```

2. Start service dependencies (PostgreSQL):
```bash
docker-compose -f docker-compose.dependencies.yml up -d
```

3. Start the application in development mode:
```bash
npm run start:dev
```

### Docker

1. Build and start all services (API + PostgreSQL):
```bash
docker compose up --build
```

The API will be available at `http://localhost:3000` and PostgreSQL at `localhost:5432`.

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
