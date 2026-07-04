const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const { createLeadRoutes } = require("./routes/leadRoutes");
const contactRoutes = require("./routes/contactRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const websiteSettingsRoutes = require("./routes/websiteSettingsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const createApp = () => {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:5177,http://127.0.0.1:5174,http://127.0.0.1:5175,http://127.0.0.1:5176,http://127.0.0.1:5177")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    return /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  };

  app.use(
    cors({
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
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
  app.disable("x-powered-by");

  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "API healthy",
      data: { timestamp: new Date().toISOString() },
    });
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
