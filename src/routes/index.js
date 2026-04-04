const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const { verifyToken } = require('../middlewares/authMiddleware');

// Auth routes (public)
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', verifyToken, userRoutes);

module.exports = router;