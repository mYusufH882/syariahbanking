const { successResponse } = require('../../../shared/utils/response.util');
const depositService = require('../services/deposit.service');
const { validateDepositRequest } = require('../validations/deposit.validation');

class DepositController {
    async createDeposit (req, res, next) { 
        try {
            const validation = await validateDepositRequest(req.body);
    
            const depositData = {
                ...validation.data,
                userId: req.user.userId
            };
    
            const result = await depositService.deposit(depositData);

            const message = result.isAccountActivated
                ? 'Deposit berhasil dan rekening anda telah diaktivasi'
                : 'Deposit berhasil';
    
            return successResponse(res, {
                message: message,
                data: {
                    transactionId: result.transactionId,
                    amount: result.amount,
                    balanceBefore: result.balanceBefore,
                    balanceAfter: result.balanceAfter,
                    status: result.status
                }
            });
        } catch (err) {
            next(err);
        }
    }

    async getDeposit(req, res, next) {
        try { 
            const userId = req.user.userId;
            const deposits = await depositService.getDeposits(userId);

            return successResponse(res, {
                message: 'Deposit berhasil diambil',
                data: { deposits }
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new DepositController();