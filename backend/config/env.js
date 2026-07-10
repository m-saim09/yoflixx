const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const requiredEnvKeys = ["PORT", "NODE_ENV", "MONGODB_URI", "JWT_SECRET"];
const allowedNodeEnvs = new Set(["development", "production", "test"]);

const isValidMongoUri = (value) => /^mongodb(?:\+srv)?:\/\//i.test(String(value || "").trim());
const getMongoUri = () => String(process.env.MONGODB_URI || "").trim();

const validateEnv = () => {
  const missing = requiredEnvKeys.filter((key) => !String(process.env[key] || "").trim());

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const nodeEnv = String(process.env.NODE_ENV || "development").trim().toLowerCase();
  if (!allowedNodeEnvs.has(nodeEnv)) {
    throw new Error("NODE_ENV must be one of: development, production, test");
  }

  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be a valid TCP port between 1 and 65535");
  }

  const mongoUri = getMongoUri();
  if (!isValidMongoUri(mongoUri)) {
    throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  }

  const jwtSecret = String(process.env.JWT_SECRET || "").trim();
  if (jwtSecret.length < 16) {
    throw new Error("JWT_SECRET must be at least 16 characters long");
  }

  return {
    port,
    nodeEnv,
    isProduction: nodeEnv === "production",
    mongoUri,
    jwtSecret,
    clientUrl: String(process.env.CLIENT_URL || "").trim(),
    adminUrl: String(process.env.ADMIN_URL || "").trim(),
    corsOrigin: String(process.env.CORS_ORIGIN || "").trim(),
  };
};

module.exports = { validateEnv, getMongoUri };
