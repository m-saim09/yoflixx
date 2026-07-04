const jwt = require("jsonwebtoken");

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

const generateToken = (admin) =>
  jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
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
