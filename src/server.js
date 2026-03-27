const app = require("./app");
const { PORT } = require("./config/env");
const { bootstrapApp } = require("./startup/bootstrap");

async function startServer() {
  await bootstrapApp();

  app.listen(PORT, () => {
    console.log(`Blog API is running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
