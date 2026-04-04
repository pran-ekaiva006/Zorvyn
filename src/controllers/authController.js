const authService = require('../services/authService');

// REGISTER
const register = async (req, res) => {
  console.log("🚀 CONTROLLER START");

  try {
    const { name, email, password, role } = req.body;

   
    console.log('Register request:', { name, email, role });

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

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
    console.error('FULL ERROR:', error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};


// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Safe logging
    console.log('Login request:', { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

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

  } catch (error) {
    console.error('FULL ERROR:', error.message);

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

module.exports = {
  register,
  login,
};