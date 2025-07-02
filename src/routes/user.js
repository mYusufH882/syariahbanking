const express = require('express');
const router = express.Router();
const userController = require('../controllers/auth/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;