const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const logger = require('./middlewares/logger');
const studentRoutes = require('./routes/studentRoutes');
const statsRoutes = require('./routes/statsRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

dotenv.config();
connectDB();

const app = express();



// ─── Middlewares globaux ──────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ──────────────────────────────────────────────
app.use('/students', studentRoutes);
app.use('/stats', statsRoutes);

// ─── Route de test ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🎓 EduNode API is running!',
    version: '1.0.0',
    routes: [
      'GET    /students',
      'GET    /students/export',
      'GET    /students/:id',
      'POST   /students',
      'PUT    /students/:id',
      'DELETE /students/:id',
      'GET    /stats/average',
    ],
  });
});

// ─── 404 ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});