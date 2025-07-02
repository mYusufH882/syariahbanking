const { successResponse } = require('../utils/response.util');
const { AppError } = require('../utils/error.util');
const userService = require('../services/user.service');

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await userService.getProfile(userId);
        
        if (!user) {
            throw new AppError('User tidak ditemukan', 404);
        }

        return successResponse(res, {
            message: 'Profil berhasil diambil',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile
};