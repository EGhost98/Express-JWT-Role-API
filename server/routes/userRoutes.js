const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');
const passwordResetController = require('../controllers/passwordResetController');

router.get('/profile', authMiddleware.Authenticate, profileController.userProfile);
router.post('/forgot-password', passwordResetController.forgotPassword);
router.post('/reset-password/:userId/:token', passwordResetController.resetPassword);

module.exports = router;
