const User = require('../models/userModel');

const getAllUsers = async () => {
  return await User.find().select('-password');
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};