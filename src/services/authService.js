const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  JWT_EXPIRES_IN,
  JWT_SECRET,
} = require("../config/env");
const userRepository = require("../repositories/userRepository");
const { toPublicUser } = require("../utils/sanitize");
const HttpError = require("../utils/httpError");

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function registerUser(payload) {
  const existingEmail = await userRepository.findByEmail(payload.email);
  if (existingEmail) {
    throw new HttpError(409, "Email is already in use.");
  }

  const existingUsername = await userRepository.findByUsername(payload.username);
  if (existingUsername) {
    throw new HttpError(409, "Username is already in use.");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const createdUser = await userRepository.createUser({
    username: payload.username,
    email: payload.email,
    passwordHash,
    role: "user",
  });

  return {
    user: toPublicUser(createdUser),
    token: signToken(createdUser),
  };
}

async function loginUser(payload) {
  const user = await userRepository.findByLogin(payload.identifier);
  if (!user) {
    throw new HttpError(401, "Invalid username/email or password.");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, "Invalid username/email or password.");
  }

  return {
    user: toPublicUser(user),
    token: signToken(user),
  };
}

module.exports = {
  loginUser,
  registerUser,
};
