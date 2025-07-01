const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Yuscode API, API active' });
});

module.exports = router;