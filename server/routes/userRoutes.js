const express = require('express');
const router = express.Router();
const protectedController = require('../controllers/protectedController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, protectedController.protectedRoute);

module.exports = router;
