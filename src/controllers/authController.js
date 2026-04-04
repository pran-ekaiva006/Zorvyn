const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    console.log('🔍 Register request received:', req.body);
    
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    console.log('📝 Calling authService.registerUser...');
    const user = await authService.registerUser({
      name,
      email,
      password,
      role,
    });

    console.log('✓ User registered:', user.email);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};