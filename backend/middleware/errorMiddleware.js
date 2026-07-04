const { AppError } = require("../utils/appError");

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;
  const isValidationError = error.name === "ValidationError";
  const isProduction = process.env.NODE_ENV === "production";

  if (error.message === "CORS origin not allowed") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed by CORS policy",
    });
  }

  if (isValidationError) {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors)[0]?.message || "Validation failed",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
  }

  if (!isProduction) {
    console.error(error);
  } else if (statusCode >= 500) {
    console.error(error.message);
  }

  return res.status(statusCode).json({
    success: false,
    message:
      isProduction && statusCode >= 500
        ? "Internal server error"
        : error.message || "Internal server error",
  });
};

module.exports = { notFound, errorHandler };
