const userRepository = require('../repositories/user.repository');
const { AppError } = require('../utils/error.util');

class UserService { 
    async getProfile(userId) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new AppError('User tidak ditemukan', 404);
        }

        return user;
    }
}

module.exports = new UserService();