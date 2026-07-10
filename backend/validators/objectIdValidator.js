const mongoose = require("mongoose");

const validateObjectIdParam = (paramName) => async (req) => {
  const id = req.params[paramName];
  if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
    return { errors: { id: "Invalid identifier" } };
  }
  return { value: { [paramName]: id } };
};

module.exports = { validateObjectIdParam };
