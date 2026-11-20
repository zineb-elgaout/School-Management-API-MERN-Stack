process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

jest.mock('../../src/services/studentService');
jest.mock('../../src/services/statsService');
jest.mock('../../src/services/authService');

const jwt = require('jsonwebtoken');
const request = require('supertest');
const { createApp } = require('../../src/app');
const studentService = require('../../src/services/studentService');
const statsService = require('../../src/services/statsService');
const authService = require('../../src/services/authService');
const AppError = require('../../src/errors/AppError');

const app = createApp();

const adminToken = jwt.sign({ sub: 'user-1', role: 'admin' }, process.env.JWT_SECRET);
const bearer = `Bearer ${adminToken}`;

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

  it('POST /students requires authentication', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'A', email: 'a@b.com' });

    expect(res.status).toBe(401);
    expect(studentService.createStudent).not.toHaveBeenCalled();
  });

  it('POST /students rejects an invalid token', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', 'Bearer invalid-token')
      .send({ name: 'A', email: 'a@b.com' });

    expect(res.status).toBe(401);
  });

  it('POST /students rejects a non-JSON content type', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', bearer)
      .set('Content-Type', 'text/plain')
      .send('name=A');

    expect(res.status).toBe(415);
  });

  it('POST /students creates a student with a valid token', async () => {
    studentService.createStudent.mockResolvedValue({
      data: { _id: '1', name: 'A' },
      restored: false,
    });

    const res = await request(app)
      .post('/students')
      .set('Authorization', bearer)
      .send({ name: 'A', email: 'a@b.com' });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ _id: '1', name: 'A' });
  });

  it('POST /auth/login delegates to the auth service', async () => {
    authService.login.mockResolvedValue({
      token: 'token',
      user: { id: 'user-1', role: 'admin' },
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@edunode.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@edunode.com',
      password: 'secret123',
    });
    expect(res.body.token).toBe('token');
  });

  it('GET /auth/me returns the current user', async () => {
    authService.getCurrentUser.mockResolvedValue({
      id: 'user-1',
      name: 'Admin',
      email: 'admin@edunode.com',
      role: 'admin',
    });

    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', bearer);

    expect(res.status).toBe(200);
    expect(authService.getCurrentUser).toHaveBeenCalledWith('user-1');
    expect(res.body.user.email).toBe('admin@edunode.com');
  });

  it('maps service AppErrors through the central error handler', async () => {
    studentService.listStudents.mockRejectedValue(new AppError(400, 'Invalid filter'));

    const res = await request(app).get('/students');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid filter' });
  });
});
