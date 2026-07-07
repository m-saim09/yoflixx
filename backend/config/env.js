const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const requiredInProduction = ["JWT_SECRET", "MONGODB_URI", "CLIENT_URL", "ADMIN_URL"];

const getMongoUri = () => process.env.MONGODB_URI || "";

const validateEnv = () => {
  const isProduction = (process.env.NODE_ENV || "development").toLowerCase() === "production";
  const missing = [];

  if (isProduction) {
    for (const key of requiredInProduction) {
      if (!process.env[key]) missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (!process.env.JWT_SECRET) {
    if (isProduction) {
      throw new Error("JWT_SECRET is required in production");
    }
    console.warn("Warning: JWT_SECRET is not set. Authentication will fail.");
  }

  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not configured. Set it before using data APIs.");
  }

  return {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction,
    mongoUri: getMongoUri(),
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL || "",
    adminUrl: process.env.ADMIN_URL || "",
    corsOrigin: process.env.CORS_ORIGIN || "",
  };
};

module.exports = { validateEnv, getMongoUri };
