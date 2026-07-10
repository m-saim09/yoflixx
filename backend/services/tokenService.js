const jwt = require("jsonwebtoken");

const getJwtSecret = () => process.env.JWT_SECRET || "dev-jwt-secret";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const crossOrigin = Boolean(process.env.CLIENT_URL);

  return {
    httpOnly: true,
    sameSite: isProduction && crossOrigin ? "none" : "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
};

const generateToken = (admin) =>
  jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

const setAuthCookie = (res, token) => {
  res.cookie("admin_token", token, getCookieOptions());
};

const clearAuthCookie = (res) => {
  res.clearCookie("admin_token", getCookieOptions());
};

module.exports = {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
};
