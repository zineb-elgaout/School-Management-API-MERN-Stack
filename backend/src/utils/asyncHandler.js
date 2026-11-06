/**
 * Wraps an async Express handler so rejected promises are forwarded to next().
 * Also returns the promise, which keeps handlers easy to unit test.
 */
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

module.exports = asyncHandler;
