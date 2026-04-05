const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// REGISTER
const register = catchAsync(async (req, res) => {
  console.log("CONTROLLER START");

  const { name, email, password, role } = req.body;
  console.log('Register request:', { name, email, role });

  try {
    const user = await authService.registerUser({
      name,
      email,
      password,
      role,
    });

    console.log('✓ User registered:', user?.email);

    const { password: _, ...safeUser } = user;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: safeUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Email already exists', 400);
    }
    throw error;
  }
});

// LOGIN
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Safe logging
  console.log('Login request:', { email });

  const { user, token } = await authService.loginUser(email, password);

  const { password: _, ...safeUser } = user;

  return res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user: safeUser,
      token,
    },
  });
});

module.exports = {
  register,
  login,
};