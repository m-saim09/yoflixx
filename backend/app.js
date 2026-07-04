const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const { createLeadRoutes } = require("./routes/leadRoutes");
const contactRoutes = require("./routes/contactRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const websiteSettingsRoutes = require("./routes/websiteSettingsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const buildAllowedOrigins = () => {
  const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "http://127.0.0.1:5177",
  ];

  const fromEnv = [process.env.CLIENT_URL, process.env.CORS_ORIGIN]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...fromEnv, ...(process.env.NODE_ENV === "production" ? [] : defaultOrigins)])];
};

const isAllowedProductionOrigin = (origin) => {
  if (!origin) return false;
  return /^(https:\/\/)[a-z0-9-]+\.vercel\.app$/i.test(origin) || /^(https:\/\/)[a-z0-9-]+\.onrender\.com$/i.test(origin);
};

const createApp = () => {
  const app = express();
  const allowedOrigins = buildAllowedOrigins();
  const isProduction = process.env.NODE_ENV === "production";

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
    if (!isProduction) {
      return /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
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
      database:
        process.env.DATABASE_PROVIDER === "file"
          ? "file"
          : mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected",
    },
  });

  app.get("/health", (req, res) => {
    res.json(healthPayload());
  });

  app.get("/api/health", (req, res) => {
    res.json(healthPayload());
  });

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
