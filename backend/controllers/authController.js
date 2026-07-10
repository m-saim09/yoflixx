const Admin = require("../models/Admin");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { clearAuthCookie, generateToken, setAuthCookie } = require("../services/tokenService");

const isDevOverrideEnabled = () => {
  const isProduction = (process.env.NODE_ENV || "development").toLowerCase() === "production";
  return !isProduction && String(process.env.DEV_OVERRIDE || "").toLowerCase() === "true";
};

const sanitizeAdmin = (admin) => ({
  id: admin._id || admin.id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  createdAt: admin.createdAt,
  lastLogin: admin.lastLogin,
});

const loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  if (isDevOverrideEnabled()) {
    const token = generateToken({
      _id: "dev",
      email,
      role: "admin",
      name: "Developer Admin",
    });
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        admin: {
          id: "dev",
          name: "Developer Admin",
          email,
          role: "admin",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
      },
    });
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!admin.isActive) {
    throw new AppError("Admin account is inactive", 403);
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = generateToken(admin);
  setAuthCookie(res, token);

  res.json({
    success: true,
    message: "Login successful",
    token,
    data: {
      admin: sanitizeAdmin(admin),
    },
  });
});

const getAdminProfile = asyncHandler(async (req, res) => {
  if (req.admin?.isDevOverride) {
    return res.json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        admin: {
          id: req.admin.id,
          name: "Developer Admin",
          email: req.admin.email,
          role: req.admin.role,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
      },
    });
  }

  const admin = await Admin.findById(req.admin.id);

  if (!admin) {
    throw new AppError("Admin not found", 404);
  }

  res.json({
    success: true,
    message: "Profile fetched successfully",
    data: {
      admin: sanitizeAdmin(admin),
    },
  });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  clearAuthCookie(res);

  res.json({
    success: true,
    message: "Logout successful",
    data: null,
  });
});

module.exports = {
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
};
