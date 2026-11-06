const jsonValidator = require('../../../src/middlewares/jsonValidator');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('jsonValidator middleware', () => {
  it('ignores non-mutating methods', () => {
    const req = { method: 'GET', headers: {}, body: {} };
    const res = makeRes();
    const next = jest.fn();

    jsonValidator(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 415 when content-type is missing', () => {
    const req = { method: 'POST', headers: {}, body: { name: 'A' } };
    const res = makeRes();
    const next = jest.fn();

    jsonValidator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(415);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 415 when content-type is not JSON', () => {
    const req = {
      method: 'PUT',
      headers: { 'content-type': 'text/plain' },
      body: { name: 'A' },
    };
    const res = makeRes();
    const next = jest.fn();

    jsonValidator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(415);
  });

  it('returns 400 when the JSON body is empty', () => {
    const req = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: {},
    };
    const res = makeRes();
    const next = jest.fn();

    jsonValidator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next for a valid JSON body', () => {
    const req = {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: { name: 'A' },
    };
    const res = makeRes();
    const next = jest.fn();

    jsonValidator(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
