const mongoose = require("mongoose");

let databaseStatus = "disconnected";
let lastError = null;

mongoose.set("strictQuery", true);

mongoose.connection.on("connected", () => {
  databaseStatus = "connected";
});

mongoose.connection.on("disconnected", () => {
  databaseStatus = "disconnected";
});

mongoose.connection.on("error", (error) => {
  databaseStatus = "error";
  lastError = error;
});

const isProduction = () => (process.env.NODE_ENV || "development").toLowerCase() === "production";

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    databaseStatus = "connected";
    return;
  }

  if (mongoose.connection.readyState === 2) {
    databaseStatus = "connecting";
    return;
  }

  const mongoUri = String(process.env.MONGODB_URI || "").trim();
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  const maxAttempts = isProduction() ? 5 : 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    databaseStatus = "connecting";

    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        autoIndex: true,
        bufferCommands: true,
      });

      databaseStatus = "connected";
      console.log("✓ MongoDB Connected");
      return;
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        databaseStatus = "error";
        console.error(`✗ MongoDB connection failed after ${attempt} attempt(s): ${error.message}`);
        if (isProduction()) {
          throw new Error(`MongoDB connection failed after ${attempt} attempt(s): ${error.message}`);
        }

        console.warn("MongoDB connection unavailable. Continuing in development mode.");
        return;
      }

      console.warn(`MongoDB connection attempt ${attempt}/${maxAttempts} failed: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
};

const getDatabaseStatus = () => databaseStatus;
const getLastDatabaseError = () => lastError;

module.exports = { connectDatabase, getDatabaseStatus, getLastDatabaseError };
