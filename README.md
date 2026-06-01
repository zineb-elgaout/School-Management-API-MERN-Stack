# School Management API - MERN Stack

A comprehensive School Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). This full-stack application provides a complete solution for managing school operations including student records, staff management, academic scheduling, and administrative tasks.

## 🎯 Features

- **Student Management**
  - Student registration and profile management
  - Academic progress tracking
  - Attendance monitoring
  - Grade management and transcripts

- **Staff Management**
  - Teacher and staff directory
  - Schedule management
  - Performance tracking
  - Leave and attendance records

- **Academic Management**
  - Class and course management
  - Curriculum planning
  - Timetable scheduling
  - Exam and assessment management

- **Administrative Dashboard**
  - Real-time analytics and reporting
  - Financial management
  - Communication and notifications
  - Document management

- **User Authentication & Authorization**
  - Role-based access control (Admin, Teacher, Student, Parent)
  - Secure authentication
  - Session management

## 🛠 Tech Stack

### Frontend
- **React** - UI library
- **CSS** - Styling
- **HTML** - Markup

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database

### DevOps
- **Docker** - Containerization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (v4.0 or higher)
- Docker (optional, for containerized deployment)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/zineb-elgaout/School-Management-API-MERN-Stack.git
cd School-Management-API-MERN-Stack
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school-management
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

**Frontend (in another terminal):**
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

### Production Mode with Docker

```bash
docker-compose up --build
```

## 📁 Project Structure

```
School-Management-API-MERN-Stack/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── controllers/       # Business logic
│   ├── middleware/        # Custom middleware
│   ├── config/           # Configuration files
│   ├── .env              # Environment variables
│   └── server.js         # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service calls
│   │   ├── styles/       # CSS files
│   │   └── App.js        # Main React component
│   └── public/           # Static files
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `GET /api/teachers/:id` - Get teacher details
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create new class
- `GET /api/classes/:id` - Get class details
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

*For complete API documentation, refer to the API docs or Postman collection.*

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Database Schema

The application uses MongoDB with the following main collections:
- **Users** - Authentication and user profiles
- **Students** - Student information
- **Teachers** - Staff information
- **Classes** - Class details
- **Courses** - Course information
- **Attendance** - Attendance records
- **Grades** - Academic grades

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub with a clear description and steps to reproduce.

## 📞 Support

For support, email support@schoolmanagement.com or open an issue in the repository.

## 🙏 Acknowledgments

- MERN Stack community
- MongoDB documentation
- Express.js community
- React documentation
- All contributors and supporters

---

**Made with ❤️ by Zineb El Ghaout**
