const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

const resolveStatusCode = (error) => {
  if (error.statusCode) return error.statusCode;
  if (error.name === 'CastError') return 400;
  if (error.name === 'ValidationError') return 400;
  if (error.code === 11000) return 409;
  return 500;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const statusCode = resolveStatusCode(error);

  if (statusCode >= 500) {
    console.error(error.stack || error);
  }

  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : error.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });
};

module.exports = { notFound, errorHandler, resolveStatusCode };
