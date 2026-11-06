process.env.API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';

jest.mock('../../src/services/studentService');
jest.mock('../../src/services/statsService');

const request = require('supertest');
const { createApp } = require('../../src/app');
const studentService = require('../../src/services/studentService');
const statsService = require('../../src/services/statsService');
const AppError = require('../../src/errors/AppError');

const app = createApp();

describe('HTTP app', () => {
  it('GET / exposes the API metadata', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('EduNode');
    expect(res.body.routes).toContain('GET    /students');
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });

  it('GET /students delegates to the service and forwards the filiere', async () => {
    studentService.listStudents.mockResolvedValue({
      count: 1,
      data: [{ name: 'A' }],
    });

    const res = await request(app).get('/students?filiere=info');

    expect(res.status).toBe(200);
    expect(studentService.listStudents).toHaveBeenCalledWith({ filiere: 'info' });
    expect(res.body).toEqual({ count: 1, data: [{ name: 'A' }] });
  });

  it('GET /stats/average returns the stats service payload', async () => {
    statsService.getStats.mockResolvedValue({
      totalStudents: 0,
      average: 0,
      byFiliere: {},
    });

    const res = await request(app).get('/stats/average');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      totalStudents: 0,
      average: 0,
      byFiliere: {},
    });
  });

  it('POST /students requires an API key', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'A', email: 'a@b.com' });

    expect(res.status).toBe(401);
    expect(studentService.createStudent).not.toHaveBeenCalled();
  });

  it('POST /students rejects a non-JSON content type', async () => {
    const res = await request(app)
      .post('/students')
      .set('x-api-key', 'test-api-key')
      .set('Content-Type', 'text/plain')
      .send('name=A');

    expect(res.status).toBe(415);
  });

  it('POST /students creates a student with a valid API key', async () => {
    studentService.createStudent.mockResolvedValue({
      data: { _id: '1', name: 'A' },
      restored: false,
    });

    const res = await request(app)
      .post('/students')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'A', email: 'a@b.com' });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ _id: '1', name: 'A' });
  });

  it('maps service AppErrors through the central error handler', async () => {
    studentService.listStudents.mockRejectedValue(new AppError(400, 'Invalid filter'));

    const res = await request(app).get('/students');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid filter' });
  });
});
