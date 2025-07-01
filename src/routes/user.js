const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/me', authMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, name: true, firstName: true, lastName: true, email: true, createdAt: true, updatedAt: true },
    });

    res.json({ user });
});

module.exports = router;