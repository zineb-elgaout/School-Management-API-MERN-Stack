const logger = (req, res, next) => {
  const start = Date.now();

  // On intercepte la fin de la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode >= 500 ? '\x1b[31m' : // rouge
      res.statusCode >= 400 ? '\x1b[33m' : // jaune
      res.statusCode >= 200 ? '\x1b[32m' : // vert
      '\x1b[0m';

    console.log(
      `${color}[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)\x1b[0m`
    );
  });

  next();
};

module.exports = logger;