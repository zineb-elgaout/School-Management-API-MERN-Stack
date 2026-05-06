const jsonValidator = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Content-Type must be application/json',
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Request body cannot be empty',
      });
    }
  }

  next();
};

module.exports = jsonValidator;