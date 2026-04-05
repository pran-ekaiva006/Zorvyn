const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//  REGISTER USER
const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.code = 11000;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    //  Prevent role injection
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: 'viewer', // always default
    });

    // Remove password before returning
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;

  } catch (error) {
    throw error;
  }
};


//  LOGIN USER
const loginUser = async (email, password) => {
  try {
    // Check if JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check user status (optional but good)
    if (user.status === 'inactive') {
      throw new Error('User account is inactive');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    //  Generate JWT (with role for RBAC)
    if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      token,
    };

  } catch (error) {
    throw error;
  }
};


module.exports = {
  registerUser,
  loginUser,
};