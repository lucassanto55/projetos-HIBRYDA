# HIBRYDA ROTAS - Backend & Infrastructure Documentation

This document provides the architectural overview and setup instructions for the backend services required by the Hibryda Rotas system.

## 1. Architecture Overview

- **Frontend:** React + TailwindCSS (Provided in the application code)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (with PostGIS for advanced geospatial queries)
- **ORM:** Prisma
- **Infrastructure:** Docker & Docker Compose

## 2. Docker Setup (`docker-compose.yml`)

Save this content as `docker-compose.yml` in your project root to spin up the database and backend.

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgis/postgis:15-3.3-alpine
    container_name: hibryda_db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: hibryda_rotas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - hibryda-net

  # Node.js API
  api:
    build: .
    container_name: hibryda_api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://admin:secretpassword@db:5432/hibryda_rotas?schema=public"
      JWT_SECRET: "your_jwt_secret_key"
      GOOGLE_MAPS_KEY: "your_google_key"
      ORS_API_KEY: "your_ors_key"
    depends_on:
      - db
    networks:
      - hibryda-net
    command: sh -c "npx prisma migrate deploy && npm start"

networks:
  hibryda-net:
    driver: bridge

volumes:
  postgres_data:
```

## 3. Prisma Schema (`schema.prisma`)

Place this in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(DRIVER)
  createdAt DateTime @default(now())
}

model Customer {
  id             String      @id @default(uuid())
  name           String
  address        String
  latitude       Float
  longitude      Float
  priority       Priority    @default(MEDIUM)
  deliveryWindow String
  routePoints    RoutePoint[]
}

model Vehicle {
  id         String   @id @default(uuid())
  plate      String   @unique
  capacity   Int
  driverName String
  status     Status   @default(AVAILABLE)
  routes     Route[]
}

model Route {
  id            String       @id @default(uuid())
  vehicleId     String
  vehicle       Vehicle      @relation(fields: [vehicleId], references: [id])
  status        RouteStatus  @default(DRAFT)
  totalDistance Float
  points        RoutePoint[]
  createdAt     DateTime     @default(now())
}

model RoutePoint {
  id         String   @id @default(uuid())
  routeId    String
  route      Route    @relation(fields: [routeId], references: [id])
  customerId String?
  customer   Customer? @relation(fields: [customerId], references: [id])
  sequence   Int
  status     PointStatus @default(PENDING)
}

enum Role {
  ADMIN
  MANAGER
  DRIVER
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

enum Status {
  AVAILABLE
  IN_TRANSIT
  MAINTENANCE
}

enum RouteStatus {
  DRAFT
  ACTIVE
  COMPLETED
}

enum PointStatus {
  PENDING
  COMPLETED
  SKIPPED
}
```

## 4. API Routes Implementation (Express)

Structure for `src/routes/routes.ts`:

```typescript
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Customers
router.get('/clientes', async (req, res) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

// Generate Route (Simplistic example, use the TSP logic from frontend in real implementation)
router.post('/rotas/gerar', async (req, res) => {
  const { vehicleId, customerIds } = req.body;
  
  // Logic to call Python script or internal TS function for Optimization
  // ...
  
  const route = await prisma.route.create({
    data: {
      vehicleId,
      totalDistance: 0, // calculated value
      status: 'DRAFT',
      points: {
        create: customerIds.map((cid, index) => ({
          customerId: cid,
          sequence: index
        }))
      }
    }
  });
  
  res.json(route);
});

export default router;
```

## 5. Running the Project

1.  **Frontend:**
    *   Currently runs as a SPA (Single Page Application).
    *   No backend required for the demo (uses `services/mockData.ts`).

2.  **Backend (Production):**
    *   Install Docker Desktop.
    *   Run `docker-compose up -d`.
    *   The API will be available at `http://localhost:3000`.
    *   Update `services/api.ts` in the frontend to point to this URL instead of mock data.
