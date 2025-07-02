const express = require('express');
const router = express.Router();

const authModule = require('../modules/auth');
const userModule = require('../modules/users');

router.use('/auth', authModule.routes);
router.use('/users', userModule.routes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Boilerplate Yuscode Backend API, API is active now !!!' });
});

module.exports = router;