# School Management API — MERN Stack

A modern school management application with a React frontend, Express/MongoDB backend, and Docker support.

---

<img width="1851" height="871" alt="image" src="https://github.com/user-attachments/assets/22138ca9-9927-40cd-b84c-5720b02ce61d" />

---




## 🚀 Overview

This repository implements a school student management system using the MERN stack:

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + MongoDB + Swagger documentation
- **Features:** student CRUD, soft delete/restore, CSV export, basic statistics, API key protection
- **Deployment:** Docker Compose for local development

## ✨ Key Features

- Create, read, update and delete student records
- Soft-delete workflow with restore support
- Filter students by department (`filiere`)
- Export active student data to CSV
- View average statistics via `/stats/average`
- Admin routes protected by `x-api-key`
- Swagger API documentation available at `/api-docs`

## 📁 Project Structure

- `backend/` — Express API server
  - `src/index.js` — server bootstrap
  - `src/routes/` — student and stats routes
  - `src/controllers/` — business logic
  - `src/models/Student.js` — Mongoose schema
  - `src/config/db.js` — MongoDB connection
  - `src/config/swagger.js` — OpenAPI specification
- `frontend/` — React application
  - `src/api/students.js` — API client
  - `src/components/` — UI components
  - `src/main.jsx` — app entrypoint

## 🛠️ Requirements

- Node.js 18+ / npm
- Docker & Docker Compose (optional, recommended)
- MongoDB connection string

## 🔧 Environment Variables

### Backend

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/school-management
API_KEY=edunode-secret-key-2024
```

### Frontend

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000
VITE_API_KEY=edunode-secret-key-2024
```

> The frontend defaults to `http://localhost:5000` and a built-in API key if none are provided.

## ⚡ Run Locally

### Backend only

```bash
cd backend
npm install
npm run dev
```

### Frontend only

```bash
cd frontend
npm install
npm run dev
```

### Full stack with Docker Compose

```bash
docker-compose up --build
```

## 🌐 API Endpoints

| Method | Path                     | Description                          |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/students`              | List active students                 |
| GET    | `/students?filiere=INFO` | Filter students by department        |
| GET    | `/students/export`       | Download active students as CSV      |
| GET    | `/students/:id`          | Get student by ID                    |
| POST   | `/students`              | Create student (admin only)          |
| PUT    | `/students/:id`          | Update student (admin only)          |
| DELETE | `/students/:id`          | Soft delete student (admin only)     |
| PATCH  | `/students/:id/restore`  | Restore deleted student (admin only) |
| GET    | `/students/deleted`      | List deleted students (admin only)   |
| GET    | `/stats/average`         | Student statistics summary           |

## 🧪 API Documentation

Swagger UI is available after starting the backend at:

```text
http://localhost:5000/api-docs
```

---
<img width="1871" height="891" alt="image" src="https://github.com/user-attachments/assets/4b962aa8-ffd1-45c3-a73c-e3eba2ca8211" />

---

## 🧩 Frontend Notes

- The app calls the backend API through `frontend/src/api/students.js`
- Protect admin actions with `x-api-key`
- Tailwind CSS is configured in `frontend/tailwind.config.js`

## 📌 Notes

- Soft delete is implemented by `isDeleted` on the student model.
- Email uniqueness is enforced for active students only.
- The API supports CSV export and basic statistics through backend services.

## 🤝 Contributing

Feel free to improve the UI, add authentication, or extend student analytics.

---

**Made with ❤️ by Zineb El Ghaout**
