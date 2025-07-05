const express = require('express');
const router = express.Router();
const depositController = require('../controllers/deposit.controller');
const authMiddleware = require('../../auth/middlewares/auth.middleware');

router.post('/create', authMiddleware, depositController.createDeposit);
router.get('/', authMiddleware, depositController.getDeposit);

module.exports = router;