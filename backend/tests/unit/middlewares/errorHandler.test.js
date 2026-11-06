const AppError = require('../../../src/errors/AppError');
const { notFound, errorHandler, resolveStatusCode } = require('../../../src/middlewares/errorHandler');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('notFound middleware', () => {
  it('responds with a 404 payload', () => {
    const res = makeRes();

    notFound({}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
  });
});

describe('resolveStatusCode', () => {
  it('uses the explicit status code of AppError', () => {
    expect(resolveStatusCode(new AppError(422, 'nope'))).toBe(422);
  });

  it('maps CastError and ValidationError to 400', () => {
    expect(resolveStatusCode({ name: 'CastError' })).toBe(400);
    expect(resolveStatusCode({ name: 'ValidationError' })).toBe(400);
  });

  it('maps duplicate key errors to 409', () => {
    expect(resolveStatusCode({ code: 11000 })).toBe(409);
  });

  it('defaults to 500', () => {
    expect(resolveStatusCode(new Error('boom'))).toBe(500);
  });
});

describe('errorHandler middleware', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('returns the AppError status and message', () => {
    const res = makeRes();

    errorHandler(new AppError(404, 'Student not found'), {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Student not found' });
  });

  it('does not leak internal messages in production', () => {
    process.env.NODE_ENV = 'production';
    const res = makeRes();

    errorHandler(new Error('database exploded'), {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('exposes internal messages outside production', () => {
    process.env.NODE_ENV = 'development';
    const res = makeRes();

    errorHandler(new Error('database exploded'), {}, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({ error: 'database exploded' });
  });
});
