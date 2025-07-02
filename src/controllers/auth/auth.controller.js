const { registerSchema, loginSchema } = require('../../validations/auth/auth.validation');
const { successResponse } = require('../../utils/response.util');
const authService = require('../../services/auth.service');

const register = async (req, res, next) => { 
    try {
        const data = registerSchema.parse(req.body);

        const user = await authService.register(data);

        return successResponse(res, {
            message: 'Registrasi berhasil',
            data: { user }
        }, 201);
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => { 
    try {
        const data = loginSchema.parse(req.body);

        const result = await authService.login(data.email, data.password);

        return successResponse(res, {
            message: 'Login berhasil',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register: register,
    login: login,
};
