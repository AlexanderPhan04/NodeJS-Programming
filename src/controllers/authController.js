const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  res.status(201).json({
    message: "User registered successfully.",
    ...result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.json({
    message: "Login successful.",
    ...result,
  });
});

module.exports = {
  login,
  register,
};
