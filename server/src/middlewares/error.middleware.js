function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: statusCode === 500 ? "Unexpected server error." : error.message });
}

module.exports = { errorHandler };
