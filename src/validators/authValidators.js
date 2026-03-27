const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  identifier: Joi.string().trim().required(),
  password: Joi.string().min(6).max(128).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
};
