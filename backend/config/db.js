const mongoose = require("mongoose");
const { getMongoUri } = require("./env");

let _mongodInstance;

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const productionOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: "majority",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDatabase = async (retries = MAX_RETRIES) => {
  if (process.env.DATABASE_PROVIDER === "file") {
    console.log("Using file-based storage; skipping MongoDB connection");
    return;
  }

  let mongoUri = getMongoUri();

  if (!mongoUri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is required in production");
    }

    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      _mongodInstance = await MongoMemoryServer.create();
      mongoUri = _mongodInstance.getUri();
      console.log("Started in-memory MongoDB (mongodb-memory-server)");
    } catch (err) {
      throw new Error(
        "MONGO_URI is not configured and mongodb-memory-server could not be started."
      );
    }
  }

  mongoose.set("strictQuery", true);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoUri, productionOptions);
      console.log("MongoDB connected");

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Mongoose will attempt to reconnect.");
      });

      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err.message);
      });

      return;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt}/${retries} failed:`,
        error.message
      );

      if (attempt === retries) {
        throw new Error(`Failed to connect to MongoDB after ${retries} attempts`);
      }

      await sleep(RETRY_DELAY_MS);
    }
  }
};

module.exports = { connectDatabase };
