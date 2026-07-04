const dotenv = require("dotenv");

dotenv.config();

const { validateEnv } = require("./config/env");
const { connectDatabase } = require("./config/db");
const { createApp } = require("./app");

const startServer = async () => {
  try {
    const config = validateEnv();
    await connectDatabase();
    const app = createApp();

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port} (${config.nodeEnv})`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

void startServer();
