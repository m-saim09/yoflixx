const { AppError } = require("../utils/appError");

const runValidator = (validator) => async (req, res, next) => {
  try {
    if (!validator) return next();
    const result = await validator(req);
    if (result && result.errors && Object.keys(result.errors).length) {
      return next(new AppError("Validation failed", 400, result.errors));
    }

    if (result && result.value) {
      req.validated = result.value;
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { runValidator };
