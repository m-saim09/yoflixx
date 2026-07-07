const mongoose = require("mongoose");

let databaseStatus = "disconnected";

mongoose.connection.on("connected", () => {
  databaseStatus = "connected";
});

mongoose.connection.on("disconnected", () => {
  databaseStatus = "disconnected";
});

mongoose.connection.on("error", () => {
  databaseStatus = "error";
});

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    databaseStatus = "connected";
    return;
  }

  if (mongoose.connection.readyState === 2) {
    databaseStatus = "connecting";
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    if ((process.env.NODE_ENV || "development").toLowerCase() === "production") {
      throw new Error("MONGODB_URI is required in production");
    }

    console.warn("MONGODB_URI is not configured. The API will fail on data access until it is set.");
    databaseStatus = "not-configured";
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });

    databaseStatus = "connected";
    console.log("MongoDB Atlas connection established");
  } catch (error) {
    databaseStatus = "error";
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const getDatabaseStatus = () => databaseStatus;

module.exports = { connectDatabase, getDatabaseStatus };
