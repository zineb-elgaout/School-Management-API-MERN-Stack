const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const logger = require('./middlewares/logger');
const studentRoutes = require('./routes/studentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  if (process.env.NODE_ENV !== 'test') {
    app.use(logger);
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/students', studentRoutes);
  app.use('/stats', statsRoutes);

  app.get('/', (req, res) => {
    res.json({
      message: '🎓 EduNode API is running!',
      version: '1.0.0',
      routes: [
        'GET    /students',
        'GET    /students/export',
        'GET    /students/deleted',
        'GET    /students/:id',
        'POST   /students',
        'PUT    /students/:id',
        'DELETE /students/:id',
        'PATCH  /students/:id/restore',
        'GET    /stats/average',
      ],
    });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
