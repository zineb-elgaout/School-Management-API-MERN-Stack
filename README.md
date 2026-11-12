# EduNode — School Management Platform

[![CI](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/ci.yml)
[![Docker Image CI](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/docker-image.yml)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](#license)

A production-minded, full-stack school management application built on the **MERN** stack. EduNode pairs a
layered REST API with a modern React dashboard for managing students, tracking grades, exporting
reports, and recovering soft-deleted records — all with interactive API documentation and Docker support.

> **Highlights:** clean layered backend · 81 automated tests · Swagger/OpenAPI docs · soft delete &
> restore · CSV export · API-key protection · rate limiting · CI/CD with Docker image validation.

---

## Table of Contents

- [Why EduNode](#why-edunode)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Model & Validation](#data-model--validation)
- [Testing](#testing)
- [Continuous Integration](#continuous-integration)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

---

## Why EduNode

EduNode is designed as a reference for building a maintainable full-stack application, not just a CRUD demo:

- **Separation of concerns** — HTTP handling, business rules, and data access never bleed into each other.
- **Defensive by default** — timing-safe API-key checks, rate limiting, strict input validation, and CSV
  injection protection.
- **Operationally ready** — containerized services, health-friendly bootstrap, environment-based configuration,
  and CI that runs tests, linting, builds, and Docker image validation.
- **Tested** — Jest + Supertest across services, controllers, middlewares, and utilities.

## Tech Stack

| Layer          | Technologies                                                                 |
| -------------- | ---------------------------------------------------------------------------- |
| **Frontend**   | React 19 · Vite 8 · Tailwind CSS 3 · Axios                                   |
| **Backend**    | Node.js · Express 5 · Mongoose 9                                             |
| **Database**   | MongoDB                                                                      |
| **API Docs**   | Swagger (swagger-jsdoc + swagger-ui-express)                                 |
| **Testing**    | Jest · Supertest                                                             |
| **DevOps**     | Docker · Docker Compose · GitHub Actions                                     |
| **Tooling**    | ESLint · nodemon · dotenv · CORS · express-rate-limit                        |

## Architecture

The backend follows a strict layered flow, keeping transport, business logic, and persistence isolated:

```text
HTTP Request
     │
     ▼
┌──────────┐   ┌─────────────┐   ┌──────────┐   ┌──────────────┐   ┌────────┐
│  Routes  │──▶│ Controllers │──▶│ Services │──▶│ Repositories │──▶│ Models │
└──────────┘   └─────────────┘   └──────────┘   └──────────────┘   └────────┘
     │               │                │                 │
  middleware       AppError        business rules    Mongoose queries
  auth / rate      asyncHandler    validation        MongoDB
  JSON / errors
```

- **Routes** declare endpoints and attach middleware.
- **Controllers** stay thin — they translate HTTP to service calls and back.
- **Services** own validation and business rules (normalization, restore-on-create, conflict handling).
- **Repositories** encapsulate every Mongoose query.
- **Models** define schema constraints and indexes.

## Features

### Students

- Full CRUD with a clean, tested API.
- **Soft delete** via an `isDeleted` flag, with a dedicated **trash** view and **restore** endpoint.
- Filter active students by department (`filiere`).
- Re-creating a soft-deleted email transparently restores and updates that record.
- Grade tracking with per-student averages.

### Reporting & insights

- **CSV export** of active students, hardened against CSV/formula injection.
- **Statistics** endpoint: total active students, overall average, and per-department analytics (count, average, min, max).

### Security & reliability

- Admin routes protected by an `x-api-key` header using **timing-safe comparison**.
- **Rate limiting** on student creation (10 requests/minute/IP).
- Strict **JSON content-type** and empty-body validation.
- Centralized error handling with consistent `{ error }` responses.
- Environment-based configuration; no secrets committed.

### Frontend experience

- Responsive React dashboard built with Tailwind CSS.
- Statistics cards, filterable student table, and create/edit forms.
- Active students vs. trash (deleted) views with restore actions.
- One-click CSV export and toast-style feedback.

### Developer experience

- Interactive **Swagger UI** at `/api-docs`.
- Automated backend tests and frontend lint/build checks.
- CI validates Docker image builds with layer caching.

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app factory
│   │   ├── index.js                # Server bootstrap
│   │   ├── config/                 # MongoDB connection + Swagger spec
│   │   ├── controllers/            # HTTP handlers
│   │   ├── errors/                 # AppError
│   │   ├── middlewares/           # Auth, errors, logger, rate limit, JSON validation
│   │   ├── models/                 # Mongoose models
│   │   ├── repositories/           # Data-access layer
│   │   ├── routes/                 # Student and stats routes
│   │   ├── services/               # Business logic
│   │   └── utils/                  # Async handler, CSV, stats helpers
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/                     # Static assets (favicon)
│   ├── src/
│   │   ├── api/                    # Axios API client
│   │   ├── components/             # StatsCard, StudentForm, StudentTable
│   │   ├── App.jsx                 # Dashboard shell
│   │   ├── index.css               # Tailwind entry point
│   │   └── main.jsx                # React bootstrap
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/
│   ├── ci.yml                      # Backend tests + frontend lint/build
│   └── docker-image.yml            # Docker image build validation
├── docker-compose.yml
└── README.md
```

## Prerequisites

- **Node.js 24+** and **npm 11+**
- **MongoDB** (local instance or the Docker Compose service)
- **Docker & Docker Compose** (optional, recommended for the full stack)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zineb-elgaout/School-Management-API-MERN-Stack.git
cd School-Management-API-MERN-Stack
```

### 2. Configure environment variables

Copy the example files and adjust the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Make sure `VITE_API_KEY` matches the backend `API_KEY`.

### 3. Run the backend

```bash
cd backend
npm install
npm run dev        # nodemon → http://localhost:5000
# or
npm start
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev        # Vite → http://localhost:5173
```

### Option: run everything with Docker Compose

```bash
docker compose up --build
```

| Service  | URL                     |
| -------- | ----------------------- |
| Frontend | http://localhost:5173   |
| Backend  | http://localhost:5000   |
| Swagger  | http://localhost:5000/api-docs |
| MongoDB  | `localhost:27017`       |

## Environment Variables

### Backend — `backend/.env`

| Variable    | Description                          | Example                              |
| ----------- | ------------------------------------ | ------------------------------------ |
| `PORT`      | HTTP port                            | `5000`                               |
| `MONGO_URI` | MongoDB connection string            | `mongodb://localhost:27017/edunode`  |
| `API_KEY`   | Secret key for protected routes      | `your_secret_key_here`               |
| `NODE_ENV`  | Runtime environment                  | `development`                        |

When running through Docker Compose, point MongoDB at the service hostname:

```env
MONGO_URI=mongodb://mongo:27017/edunode
```

### Frontend — `frontend/.env`

| Variable       | Description                     | Example                     |
| -------------- | ------------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API     | `http://localhost:5000`     |
| `VITE_API_KEY` | Must match the backend `API_KEY`| `your_secret_key_here`      |

## API Reference

**Base URL:** `http://localhost:5000`

| Method | Endpoint                   | Auth (`x-api-key`) | Description                                |
| ------ | -------------------------- | :----------------: | ------------------------------------------ |
| GET    | `/`                        |         No         | API metadata and available routes          |
| GET    | `/students`                |         No         | List active students                       |
| GET    | `/students?filiere=INFO`   |         No         | Filter active students by department       |
| GET    | `/students/export`         |         No         | Download active students as CSV            |
| GET    | `/students/deleted`        |        Yes         | List soft-deleted students (trash)         |
| GET    | `/students/:id`            |         No         | Get a student by ID                        |
| POST   | `/students`                |        Yes         | Create a student (rate-limited)            |
| PUT    | `/students/:id`            |        Yes         | Update a student                           |
| DELETE | `/students/:id`            |        Yes         | Soft delete a student                      |
| PATCH  | `/students/:id/restore`    |        Yes         | Restore a soft-deleted student             |
| GET    | `/stats/average`           |         No         | Overall and per-department statistics      |

Protected routes require the API key header:

```http
x-api-key: your_secret_key_here
```

Valid departments (`filiere`): `INFO`, `MATH`, `ECO`, `PHYS`, `CHIMIE`.

### Example requests

**Create a student**

```bash
curl -X POST http://localhost:5000/students \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_key_here" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","filiere":"INFO","grades":[18,17]}'
```

**Filter students by department**

```bash
curl "http://localhost:5000/students?filiere=INFO"
```

**Export active students to CSV**

```bash
curl -O http://localhost:5000/students/export
```

**Restore a soft-deleted student**

```bash
curl -X PATCH http://localhost:5000/students/<id>/restore \
  -H "x-api-key: your_secret_key_here"
```

### Response shape

```json
{
  "count": 2,
  "data": [
    {
      "_id": "664f1b2c9e1a2b3c4d5e6f7a",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "filiere": "INFO",
      "grades": [18, 17],
      "isDeleted": false,
      "createdAt": "2026-04-28T10:00:00.000Z",
      "updatedAt": "2026-04-28T10:00:00.000Z"
    }
  ]
}
```

### Interactive documentation

Swagger UI is available while the backend is running:

```text
http://localhost:5000/api-docs
```

## Data Model & Validation

| Field       | Type       | Rules                                                        |
| ----------- | ---------- | ------------------------------------------------------------ |
| `name`      | `String`   | Required, trimmed                                            |
| `email`     | `String`   | Required, normalized to lowercase, unique among active users |
| `filiere`   | `String`   | Required, one of `INFO`, `MATH`, `ECO`, `PHYS`, `CHIMIE`     |
| `grades`    | `Number[]` | Each grade must be between `0` and `20`                      |
| `isDeleted` | `Boolean`  | Soft-delete flag, defaults to `false`                        |
| timestamps  | `Date`     | `createdAt` / `updatedAt` managed automatically              |

Additional rules:

- Email uniqueness is enforced with a **partial unique index** scoped to active records, so a
  deleted student can be restored or re-created.
- `POST` and `PUT` require `Content-Type: application/json` and a non-empty body.
- `POST /students` is limited to **10 requests per minute per IP**.

## Testing

The backend ships with unit and integration tests:

```bash
cd backend
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:coverage # coverage report in backend/coverage
```

Current status: **81 tests across 9 suites**, covering services, controllers, middlewares, utilities,
and the Express app.

Frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

## Continuous Integration

Two GitHub Actions workflows run on pushes and pull requests:

### `ci.yml` — quality gate

- **Backend — tests:** `npm ci` → Jest with coverage → upload coverage artifact.
- **Frontend — lint & build:** `npm ci` → ESLint → production build with Vite.

### `docker-image.yml` — container build validation

- Builds the `backend` and `frontend` images from their Dockerfiles.
- Uses Docker Buildx with GitHub Actions layer caching.
- Validates that images build successfully (`push: false`).

## Docker

The repository includes Dockerfiles for both services and a `docker-compose.yml` that provisions
MongoDB, the backend, and the frontend on a shared network.

```bash
docker compose up --build     # start the full stack
docker compose down           # stop services
docker compose down -v        # stop and remove the MongoDB volume
```

The Compose setup mounts source code for live development and reads configuration from
`backend/.env` and `frontend/.env`.

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and run tests/lint locally.
3. Commit with a clear message and push your branch.
4. Open a pull request against `main`.

Please keep the layered architecture intact and add tests for new backend behavior.

## License

Released under the **ISC License**.
