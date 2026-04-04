const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'viewer',
    });

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (user.status === 'inactive') {
      throw new Error('User account is inactive');
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user and token
    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
};