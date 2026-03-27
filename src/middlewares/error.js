const multer = require("multer");
const HttpError = require("../utils/httpError");

function notFoundHandler(req, res, next) {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found.`));
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      error: "Invalid resource id.",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Database validation failed.",
      details: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      error: "Duplicate value violates a unique field.",
    });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: error.code === "LIMIT_FILE_SIZE"
        ? "Uploaded image exceeds the maximum allowed size."
        : error.message,
    });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: "Invalid JSON payload.",
    });
  }

  const statusCode = error.statusCode || 500;
  const response = {
    error: error.message || "Internal server error.",
  };

  if (error.details) {
    response.details = error.details;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
