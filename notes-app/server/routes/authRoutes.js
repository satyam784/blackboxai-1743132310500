const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Password reset routes
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protected routes (require login)
router.use(authController.protect);

// Update password for logged-in users
router.patch('/updateMyPassword', authController.updatePassword);

module.exports = router;