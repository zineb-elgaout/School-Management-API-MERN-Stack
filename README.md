# School Management API — MERN Stack

[![CI](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/ci.yml)
[![Docker Image CI](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/zineb-elgaout/School-Management-API-MERN-Stack/actions/workflows/docker-image.yml)

A full-stack school management application built with the MERN stack. It provides a REST API for managing students, a React dashboard, CSV export, statistics, soft delete, Swagger documentation, and Docker support.

## Technologies

| Layer    | Stack                                                 |
| -------- | ----------------------------------------------------- |
| Frontend | React 19, Vite 8, Tailwind CSS 3, Axios, React Router |
| Backend  | Node.js, Express 5, Mongoose 9                        |
| Database | MongoDB                                                |
| API docs | Swagger (swagger-jsdoc + swagger-ui-express)           |
| Testing  | Jest, Supertest                                        |
| DevOps   | Docker, Docker Compose, GitHub Actions                |

## Features

- Student CRUD (create, read, update, delete)
- Soft delete via the `isDeleted` flag
- Filter active students by `filiere`
- Export active students to CSV
- Average grade statistics via `/stats/average`
- Admin routes protected by an `x-api-key` header
- Rate limiting on student creation
- JSON content-type and empty-body validation
- Interactive Swagger documentation at `/api-docs`
- Layered backend architecture: routes → controllers → services → repositories → model
- Frontend dashboard with student table, form, statistics cards, and deleted-students view
- Clean layered architecture that keeps HTTP, business logic, and data access separate
- Centralized error handling with `AppError` and a shared error middleware
- Reusable `asyncHandler` for concise async controllers
- Request validation (API key, JSON content type, non-empty body) and rate limiting
- Automated tests across services, controllers, middlewares, and utilities
- Continuous integration for tests, linting, builds, and Docker images

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app factory
│   │   ├── index.js               # Server bootstrap
│   │   ├── config/                # MongoDB connection + Swagger spec
│   │   ├── controllers/           # HTTP handlers
│   │   ├── errors/                # AppError
│   │   ├── middlewares/           # Auth, error handler, logger, rate limit, JSON validation
│   │   ├── models/                # Mongoose models
│   │   ├── repositories/          # Data access layer
│   │   ├── routes/                # Student and stats routes
│   │   ├── services/              # Business logic
│   │   └── utils/                 # Async handler, CSV, stats helpers
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                   # Axios API client
│   │   ├── components/            # StudentTable, StudentForm, StatsCard
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/
│   ├── ci.yml                     # Tests, lint, build
│   └── docker-image.yml           # Docker image builds
├── docker-compose.yml
└── README.md
```

## Prerequisites

- **Node.js 24+** with **npm 11+**
- **MongoDB** (local instance or Docker)
- **Docker & Docker Compose** (optional, recommended)

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/edunode
API_KEY=your_secret_key_here
NODE_ENV=development
```

When running through Docker Compose, use the MongoDB service hostname:

```env
MONGO_URI=mongodb://mongo:27017/edunode
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_API_KEY=your_secret_key_here
```

`VITE_API_KEY` must match the backend `API_KEY`.

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev        # nodemon, http://localhost:5000
# or
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Vite, http://localhost:5173
```

### Full stack with Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: `localhost:27017`

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Path                | Auth (`x-api-key`) | Description                          |
| ------ | ------------------- | ------------------ | ------------------------------------ |
| GET    | `/`                 | No                 | API metadata and route list          |
| GET    | `/students`         | No                 | List active students                 |
| GET    | `/students?filiere=`| No                 | Filter active students by department |
| GET    | `/students/export`  | No                 | Download active students as CSV      |
| GET    | `/students/:id`     | No                 | Get a student by ID                  |
| POST   | `/students`         | Yes                | Create a student (rate-limited)      |
| PUT    | `/students/:id`     | Yes                | Update a student                     |
| DELETE | `/students/:id`     | Yes                | Soft delete a student                |
| GET    | `/stats/average`    | No                 | Student count, average, by department|

Protected routes require:

```http
x-api-key: your_secret_key_here
```

`filiere` values: `INFO`, `MATH`, `ECO`, `PHYS`, `CHIMIE`.

### Example request

```bash
curl -X POST http://localhost:5000/students \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_key_here" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","filiere":"INFO","grades":[18,17]}'
```

## API Documentation

Swagger UI is available once the backend is running:

```text
http://localhost:5000/api-docs
```

## Testing

Backend tests use Jest and Supertest:

```bash
cd backend
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:coverage # coverage report in backend/coverage
```

Frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

## Continuous Integration

Two GitHub Actions workflows run on pushes and pull requests:

### `ci.yml`

- **Backend — tests:** installs dependencies with `npm ci`, runs Jest with coverage, uploads the coverage report as an artifact.
- **Frontend — lint & build:** installs dependencies with `npm ci`, runs ESLint, then builds the production bundle with Vite.

### `docker-image.yml`

- Builds the `backend` and `frontend` Docker images from their respective Dockerfiles.
- Uses Docker Buildx with GitHub Actions layer caching.
- Does not push images (`push: false`); it only validates that the images build.

## Notes

- Soft delete is implemented with the `isDeleted` field on the `Student` model.
- Email uniqueness is enforced by MongoDB.
- Grades must be between 0 and 20.
- `POST /students` is rate-limited to 10 requests per minute per IP.
- CORS is enabled for local development.

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and run the tests/lint locally.
3. Commit and push your branch.
4. Open a pull request against `main`.

## License

ISC
