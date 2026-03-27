const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const userRepository = require("../repositories/userRepository");
const { toPublicUser } = require("../utils/sanitize");
const HttpError = require("../utils/httpError");

async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Authorization token is missing.");
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new HttpError(401, "Token is valid but user no longer exists.");
    }

    req.user = toPublicUser(user);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new HttpError(401, "Invalid or expired token."));
    }

    return next(error);
  }
}

module.exports = {
  requireAuth,
};
