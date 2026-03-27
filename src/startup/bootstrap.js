const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_USERNAME,
  UPLOAD_DIR,
} = require("../config/env");
const { connectDatabase } = require("../config/db");
const userRepository = require("../repositories/userRepository");

async function ensureProjectFiles() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

async function seedAdminUser() {
  const adminExists = await userRepository.hasAdminUser();
  if (adminExists) {
    return;
  }

  const emailTaken = await userRepository.findByEmail(DEFAULT_ADMIN_EMAIL);
  const usernameTaken = await userRepository.findByUsername(DEFAULT_ADMIN_USERNAME);
  if (emailTaken || usernameTaken) {
    console.warn(
      "Skipping default admin bootstrap because the configured username/email already exists."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await userRepository.createUser({
    username: DEFAULT_ADMIN_USERNAME,
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash,
    role: "admin",
  });

  console.log(`Default admin created: ${DEFAULT_ADMIN_EMAIL}`);
}

async function bootstrapApp() {
  await connectDatabase();
  await ensureProjectFiles();
  await seedAdminUser();
}

module.exports = {
  bootstrapApp,
};
