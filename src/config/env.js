const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(process.cwd(), ".env"), quiet: true });

const PORT = Number(process.env.PORT) || 4000;

module.exports = {
  PORT,
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret-before-deploy",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  PUBLIC_DIR: path.join(process.cwd(), "public"),
  UPLOAD_DIR: path.join(process.cwd(), "public", "uploads"),
  BASE_URL: process.env.BASE_URL || `http://localhost:${PORT}`,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/NodeJS-Programming",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "NodeJS-Programming",
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024,
  DEFAULT_ADMIN_USERNAME: process.env.DEFAULT_ADMIN_USERNAME || "admin",
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com",
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123456",
};
