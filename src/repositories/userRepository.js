const User = require("../models/User");

function normalizeDate(value) {
  if (!value) {
    return value;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  const plainUser = typeof user.toObject === "function" ? user.toObject() : user;

  return {
    id: String(plainUser._id || plainUser.id),
    username: plainUser.username,
    email: plainUser.email,
    passwordHash: plainUser.passwordHash,
    role: plainUser.role,
    createdAt: normalizeDate(plainUser.createdAt),
    updatedAt: normalizeDate(plainUser.updatedAt),
  };
}

async function getAllUsers() {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return users.map(normalizeUser);
}

async function findById(id) {
  const user = await User.findById(id).lean();
  return normalizeUser(user);
}

async function findByEmail(email) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).lean();
  return normalizeUser(user);
}

async function findByUsername(username) {
  const user = await User.findOne({ username: username.trim() })
    .collation({ locale: "en", strength: 2 })
    .lean();

  return normalizeUser(user);
}

async function findByLogin(identifier) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
  })
    .collation({ locale: "en", strength: 2 })
    .lean();

  return normalizeUser(user);
}

async function hasAdminUser() {
  const admin = await User.exists({ role: "admin" });
  return Boolean(admin);
}

async function createUser(payload) {
  const createdUser = await User.create({
    username: payload.username.trim(),
    email: payload.email.trim().toLowerCase(),
    passwordHash: payload.passwordHash,
    role: payload.role || "user",
  });

  return normalizeUser(createdUser);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByLogin,
  findByUsername,
  getAllUsers,
  hasAdminUser,
  normalizeUser,
};
