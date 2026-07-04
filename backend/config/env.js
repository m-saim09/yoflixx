const requiredInProduction = ["JWT_SECRET", "MONGODB_URI"];

const getMongoUri = () =>
  process.env.MONGODB_URI || process.env.MONGO_URI || "";

const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const missing = [];

  if (isProduction) {
    for (const key of requiredInProduction) {
      if (key === "MONGODB_URI") {
        if (!getMongoUri()) missing.push("MONGODB_URI (or MONGO_URI)");
        continue;
      }
      if (!process.env[key]) missing.push(key);
    }

    if (process.env.DATABASE_PROVIDER === "file") {
      throw new Error(
        "DATABASE_PROVIDER=file is not allowed in production. Remove it and set MONGODB_URI."
      );
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (!process.env.JWT_SECRET && !isProduction) {
    console.warn("Warning: JWT_SECRET is not set. Authentication will fail.");
  }

  return {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction,
    mongoUri: getMongoUri(),
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL || "",
    corsOrigin: process.env.CORS_ORIGIN || "",
  };
};

module.exports = { validateEnv, getMongoUri };
