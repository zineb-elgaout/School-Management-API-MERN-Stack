const adminAuth = require('../../../src/middlewares/auth');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminAuth middleware', () => {
  const originalKey = process.env.API_KEY;

  afterEach(() => {
    process.env.API_KEY = originalKey;
  });

  it('returns 500 when the server API key is not configured', () => {
    delete process.env.API_KEY;
    const req = { headers: { 'x-api-key': 'anything' } };
    const res = makeRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the API key is missing', () => {
    process.env.API_KEY = 'secret';
    const req = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when the API key is invalid', () => {
    process.env.API_KEY = 'secret';
    const req = { headers: { 'x-api-key': 'wrong' } };
    const res = makeRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when the API key is valid', () => {
    process.env.API_KEY = 'secret';
    const req = { headers: { 'x-api-key': 'secret' } };
    const res = makeRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects keys of different length without throwing', () => {
    expect(adminAuth.safeCompare('short', 'a-much-longer-key')).toBe(false);
    expect(adminAuth.safeCompare(undefined, 'secret')).toBe(false);
  });
});
