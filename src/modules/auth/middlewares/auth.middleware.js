const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../shared/config/jwt.config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token gak ada nihh!!! (Unauthorized)' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = {
            userId: decoded.id,
            email: decoded.email,
            name: decoded.name,
            firstName: decoded.firstName,
            lastName: decoded.lastName
        };
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Token gak valid nihhhh!!!'
        });
    }
};

module.exports = authMiddleware;