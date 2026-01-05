# ARCOSONE Backend

## Overview
A NestJS backend API application with PostgreSQL database using Prisma ORM.

## Tech Stack
- **Runtime**: Node.js with pnpm package manager
- **Framework**: NestJS 11
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript

## Project Structure
```
src/
├── config/           # Configuration files
├── decorators/       # Custom decorators
├── filters/          # Exception filters
├── guards/           # Authentication guards
├── interceptors/     # Response interceptors
├── middlewares/      # Request middlewares
├── modules/
│   ├── predict-os/   # Predict-OS feature module
│   └── user/         # User feature module
├── prisma/           # Prisma service
├── app.module.ts     # Root module
└── main.ts           # Application entry point
prisma/
└── schema.prisma     # Database schema
```

## Available Scripts
- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run start:prod` - Start production server
- `pnpm run build` - Build the application
- `pnpm run prisma:generate` - Generate Prisma client
- `pnpm run prisma:migrate` - Run database migrations
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests

## API Endpoints
- `GET /` - Health check (returns "Hello World!")
- `/user` - User management endpoints
- `/predict-os` - Prediction service endpoints

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `PORT` - Server port (default: 5000)

## Recent Changes
- 2026-01-05: Initial import and configuration for Replit environment
  - Configured to run on port 5000
  - Connected to Replit PostgreSQL database
  - Generated Prisma client
