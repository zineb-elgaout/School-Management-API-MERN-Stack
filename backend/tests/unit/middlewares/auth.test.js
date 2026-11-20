jest.mock('../../../src/utils/token', () => ({
  verifyToken: jest.fn(),
}));

const { verifyToken } = require('../../../src/utils/token');
const {
  authenticate,
  authorize,
  getBearerToken,
} = require('../../../src/middlewares/auth');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getBearerToken', () => {
  it('extracts the token from a Bearer header', () => {
    expect(getBearerToken('Bearer abc.def.ghi')).toBe('abc.def.ghi');
  });

  it('returns null for missing or malformed headers', () => {
    expect(getBearerToken(undefined)).toBeNull();
    expect(getBearerToken('Basic abc')).toBeNull();
    expect(getBearerToken('Bearer')).toBeNull();
  });
});

describe('authenticate middleware', () => {
  it('returns 401 when the Authorization header is missing', () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is invalid or expired', () => {
    verifyToken.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const req = { headers: { authorization: 'Bearer bad-token' } };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches the user and calls next for a valid token', () => {
    verifyToken.mockReturnValue({ sub: 'user-1', role: 'admin' });

    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(req.user).toEqual({ id: 'user-1', role: 'admin' });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('authorize middleware', () => {
  it('returns 401 when no user is attached', () => {
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    authorize('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when the role is not allowed', () => {
    const req = { user: { id: 'u1', role: 'student' } };
    const res = makeRes();
    const next = jest.fn();

    authorize('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when the role is allowed', () => {
    const req = { user: { id: 'u1', role: 'admin' } };
    const res = makeRes();
    const next = jest.fn();

    authorize('admin')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
