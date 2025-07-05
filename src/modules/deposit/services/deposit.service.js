const depositRepository = require('../repositories/deposit.repository');
const { AppError } = require('../../../shared/utils/error.util');
const { generateTransactionId } = require('../../../shared/utils/generator');

class DepositService { 
    async validateAccount(accountNumber, userId) {
        const account = await depositRepository.getAccountByUser(accountNumber, userId);
        
        if (!account) {
            throw new AppError("Rekening tidak ditemukan", 404);
        }

        return account;
    }

    async validateAccountActivation(account, amount) {
        if (!account.isActive && amount < 50000) {
            throw new AppError("Deposit minimal Rp 50.000 untuk aktivasi rekening", 400);
        }

        return true;
    }

    async validateDailyLimit(userId, amount, isAccountActivate) {
        if (isAccountActivate) {
            const dailyTotal = await depositRepository.getDailyDepositTotal(userId);

            if (dailyTotal + amount > 10000000) {
                throw new AppError("Deposit harian maksimal Rp 10.000.000", 400);
            }
        }

        return true;
    }

    calculateBalance(currentBalance, depositAmount) {
        const balanceBefore = parseFloat(currentBalance.toString());
        const amount = parseFloat(depositAmount.toString());
        const balanceAfter = balanceBefore + amount;

        return {
            balanceBefore: balanceBefore,
            balanceAfter: balanceAfter
        };
    }

    shouldActivateAccount(account, amount) {
        return !account.isActive && amount >= 50000;
    }

    async deposit(data) {
        try {
            const transactionId = generateTransactionId();

            const account = await this.validateAccount(data.accountNumber, data.userId);

            if (!account || account.length === 0) {
                throw new AppError("Akun Rekening tidak ditemukan", 404);
            }

            await this.validateAccountActivation(account, data.amount);

            await this.validateDailyLimit(data.userId, data.amount, account.isActive);

            const { balanceBefore, balanceAfter } = this.calculateBalance(account.balance, data.amount);

            const shouldActivate = this.shouldActivateAccount(account, data.amount);

            const depositData = {
                ...data,
                transactionId
            };

            const result = await depositRepository.executeDepositTransaction(
                depositData,
                account,
                balanceBefore,
                balanceAfter,
                shouldActivate
            );

            return {
                transactionId: result.transactionId,
                amount: result.amount,
                balanceBefore: result.balanceBefore,
                balanceAfter: result.balanceAfter,
                status: result.status,
                isAccountActivated: shouldActivate
            };
        } catch (error) {
            throw new AppError(error.message || 'Deposit Gagal', error.statusCode || 500);
        }
    }

    async getDeposits(userId) {
        const deposit = await depositRepository.getDepositByUser(userId);

        if (!deposit || deposit.length === 0) {
            throw new AppError("Deposit tidak ditemukan", 404);
        }

        return deposit;
    }
}

module.exports = new DepositService();