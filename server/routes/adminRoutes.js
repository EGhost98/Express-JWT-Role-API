const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/get-all-users', authMiddleware.Authenticate, authMiddleware.isAdmin, adminController.getAllUsers);

module.exports = router;
