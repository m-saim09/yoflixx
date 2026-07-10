const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const fs = require("fs");

const envPath = path.resolve(__dirname, "..", ".env");
const originalEnv = { ...process.env };

const loadEnv = () => {
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath, override: true });
  }
};

test("validateEnv rejects invalid MongoDB URIs", () => {
  process.env.NODE_ENV = "development";
  process.env.PORT = "5000";
  process.env.MONGODB_URI = "localhost:27017/yoflix";
  process.env.JWT_SECRET = "test-secret";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.ADMIN_URL = "http://localhost:5174";

  const { validateEnv } = require("../config/env");
  assert.throws(() => validateEnv(), /MONGODB_URI/i);
});

test("validateEnv reports missing required variables", () => {
  process.env.NODE_ENV = "development";
  process.env.PORT = "5000";
  process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/yoflix";
  process.env.JWT_SECRET = "";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.ADMIN_URL = "http://localhost:5174";

  const { validateEnv } = require("../config/env");
  assert.throws(() => validateEnv(), /JWT_SECRET/i);
});

test.afterEach(() => {
  process.env = { ...originalEnv };
  loadEnv();
});
