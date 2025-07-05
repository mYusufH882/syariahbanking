const prisma = require('../../../shared/config/database');
const { generateAccountNumber } = require('../../../shared/utils/generator');

class AuthRepository { 
    async create(userData) { 
        return await prisma.user.create({
            data: {
                ...userData,
                accounts: {
                    create: {
                        accountName: generateAccountNumber(),
                        accountType: 'SAVINGS',
                        accountNumber: `ACC-${Date.now()}`,
                        balance: 0,
                        isActive: false,
                    }
                }
            },
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