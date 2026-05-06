const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🎓 EduNode API',
      version: '1.0.0',
      description: 'API REST de gestion des étudiants — MERN Stack',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur local (Docker)',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
      schemas: {
        Student: {
          type: 'object',
          required: ['name', 'email', 'filiere'],
          properties: {
            _id: { type: 'string', example: '664f1b2c9e1a2b3c4d5e6f7a' },
            name: { type: 'string', example: 'Ahmed Benali' },
            email: { type: 'string', example: 'ahmed@edunode.com' },
            filiere: {
              type: 'string',
              enum: ['INFO', 'MATH', 'ECO', 'PHYS', 'CHIMIE'],
              example: 'INFO',
            },
            grades: {
              type: 'array',
              items: { type: 'number' },
              example: [14, 16, 12, 18],
            },
            isDeleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', example: '2026-04-28T10:00:00.000Z' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);