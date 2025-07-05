const prisma = require('../../../shared/config/database');

class DepositRepository {
    async getActiveAccountByUser(accountNumber, userId, tx = null) { 
        const client = tx || prisma;

        return await client.account.findFirst({
            where: {
                userId: userId,
                accountNumber: accountNumber,
                isActive: true,
            },
        });
    }

    async getAccountByUser(accountNumber, userId, tx = null) { 
        const client = tx || prisma;

        return await client.account.findFirst({
            where: {
                userId: userId,
                accountNumber: accountNumber,
            },
        });
    }

    async activateAccount(accountId, tx = null) {
        const client = tx || prisma;

        return await client.account.update({
            where: { id: accountId },
            data: {
                isActive: true,
                updatedAt: new Date(),
            }
        });
    }

    async getDailyDepositTotal(userId, tx = null) {
        const client = tx || prisma;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await client.transaction.aggregate({
            where: {
                userId,
                type: 'DEPOSIT',
                status: 'SUCCESS',
                createdAt: {
                    gte: today,
                },
            },
            _sum: {
                amount: true,
            },
        });

        return parseFloat(result._sum.amount?.toString() || '0');
    }

    async createDepositTransaction(data, tx = null) {
        const client = tx || prisma;

        return await client.transaction.create({
            data: {
                ...data,
                amount: parseFloat(data.amount.toString()),
                balanceBefore: parseFloat(data.balanceBefore.toString()),
                balanceAfter: parseFloat(data.balanceAfter.toString()),
            }
        });
    }

    async updateAccountBalance(accountId, newBalance, tx = null) {
        const client = tx || prisma;

        return await client.account.update({
            where: { id: accountId },
            data: {
                balance: parseFloat(newBalance.toString()),
                updatedAt: new Date(),
            }
        });
    }

    async updateStatusTransaction(transactionId, tx = null) {
        const client = tx || prisma;

        return await client.transaction.update({
            where: { id: transactionId },
            data: {
                status: 'SUCCESS',
                updatedAt: new Date(),
            }
        });
    }

    async executeDepositTransaction(depositData, account, balanceBefore, balanceAfter, shouldActivate) {
        return await prisma.$transaction(async (tx) => {
            const transactionRecord = await this.createDepositTransaction({
               transactionId: depositData.transactionId,
                type: 'DEPOSIT',
                amount: depositData.amount,
                balanceBefore: balanceBefore,
                balanceAfter: balanceAfter,
                description: depositData.description || null,
                reference: depositData.reference || null,
                status: 'PENDING',
                accountId: account.id,
                userId: depositData.userId
            }, tx);
            
            await this.updateAccountBalance(account.id, balanceAfter, tx);

            if (shouldActivate) {
                await this.activateAccount(account.id, tx);
            }

            const finalTransaction = await this.updateStatusTransaction(transactionRecord.id, tx);

            return finalTransaction;
        });
    }

    async getDepositByUser(userId) {
        return await prisma.transaction.findMany({
            where: {
                userId: userId,
                type: 'DEPOSIT',
                status: 'SUCCESS'
            },
            include: {
                account: {
                    select: {
                        accountNumber: true,
                        accountType: true,
                        accountName: true,
                        isActive: true
                    }
                }
            }
        });
    }
}

module.exports = new DepositRepository();