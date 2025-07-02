const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');
const { AppError } = require('../../../shared/utils/error.util');
const jwtConfig = require('../../../shared/config/jwt.config');

class AuthService { 
    async register(userData) { 
        const existingUser = await authRepository.findByEmail(userData.email);

        if (existingUser) { 
            throw new AppError('Email sudah terdaftar', 400);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const userToCreate = {
            name: userData.name,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword,
        };

        return await authRepository.create(userToCreate);
    }

    async login(email, password) {
        if (!email || !password) {
            throw new AppError('Email dan password harus diisi', 400);
        }

        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Email atau password salah', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Email atau password salah', 401);
        }

        const token = jwt.sign(
            { id: user.id },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token
        };
    }
}

module.exports = new AuthService();