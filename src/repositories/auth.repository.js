const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthRepository { 
    async create(userData) { 
        return await prisma.user.create({
            data: userData,
            select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true
            }
        });
    }

    async findByEmail(email) { 
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id) { 
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
}

module.exports = new AuthRepository();