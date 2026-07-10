const { validateEnv } = require("./config/env");
const { connectDatabase } = require("./config/db");
const { createApp } = require("./app");

const startServer = async () => {
  try {
    const config = validateEnv();
    console.log("✓ Environment Loaded");

    await connectDatabase();
    const app = createApp();

    const server = app.listen(config.port, "0.0.0.0", () => {
      console.log("✓ Server Running");
      console.log(`✓ Port: ${config.port}`);
      console.log(`✓ Mode: ${config.nodeEnv}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}; shutting down gracefully`);
      server.close((error) => {
        if (error) {
          console.error("Error closing server:", error.message);
          process.exitCode = 1;
          return;
        }

        process.exit(0);
      });
    };

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error.message);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled rejection:", reason instanceof Error ? reason.message : reason);
      process.exit(1);
    });
  } catch (error) {
    console.error("✗ Server startup failed:", error.message);
    process.exit(1);
  }
};

void startServer();
