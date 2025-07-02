const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Boilerplate Yuscode Backend API, API is active now !!!' });
});

module.exports = router;