const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const { createLeadRoutes } = require("./routes/leadRoutes");
const contactRoutes = require("./routes/contactRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const websiteSettingsRoutes = require("./routes/websiteSettingsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { getDatabaseStatus } = require("./config/db");

const buildAllowedOrigins = () => {
  const fromEnv = [process.env.CLIENT_URL, process.env.ADMIN_URL, process.env.CORS_ORIGIN]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set(fromEnv)];
};

const isAllowedProductionOrigin = (origin) => {
  if (!origin) return false;
  return /^(https:\/\/)[a-z0-9-]+(?:[.-][a-z0-9-]+)*(?:\.vercel\.app|\.onrender\.com|\.render\.com)$/i.test(origin);
};

const createApp = () => {
  const app = express();
  const allowedOrigins = buildAllowedOrigins();
  const isProduction = (process.env.NODE_ENV || "development").toLowerCase() === "production";

  app.set("trust proxy", 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(compression());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 200 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
  });
  app.use("/api", limiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 20 : 100,
    message: { success: false, message: "Too many login attempts, please try again later." },
  });
  app.use("/api/admin/login", authLimiter);

  const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (isProduction && isAllowedProductionOrigin(origin)) {
      return true;
    }
    return false;
  };

  const corsOptions = {
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
  app.disable("x-powered-by");

  const healthPayload = () => ({
    success: true,
    message: "API healthy",
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: getDatabaseStatus(),
    },
  });

  app.get("/", (req, res) => {
    res.json({ success: true, message: "Yoflix API is running" });
  });

  app.get("/health", (req, res) => {
    res.json(healthPayload());
  });

  app.get("/api/health", (req, res) => {
    res.json(healthPayload());
  });

  const uploadsDir = path.join(__dirname, "uploads");
  if (fs.existsSync(uploadsDir)) {
    app.use("/uploads", express.static(uploadsDir));
  }

  app.use(express.static(path.join(__dirname, "public")));

  app.use("/api/admin", authRoutes);
  app.use(["/api/leads", "/api/inquiries"], createLeadRoutes());
  app.use("/api/contacts", contactRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/pricing", pricingRoutes);
  app.use("/api/settings", websiteSettingsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
