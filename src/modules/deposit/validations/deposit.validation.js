const { z } = require("zod");
const { AppError } = require("../../../shared/utils/error.util");

const depositRequestSchema = z.object({
    amount: z
        .number()
        .positive({ message: "Jumlah deposit harus lebih besar dari 0" })
        .min(10000, { message: "Jumlah deposit minimal Rp 10.000" })
        .min(50000, { message: "Jumlah deposit maksimal Rp 50.000" }),

    accountNumber: z
        .string({
            required_error: "Nomor rekening tidak boleh kosong",
            invalid_type_error: "Nomor rekening harus berupa string",
        })
        .min(10, { message: "Nomor rekening minimal 10 karakter" })
        .max(25, { message: "Nomor rekening maksimal 25 karakter" }),
    
    description: z
        .string()
        .max(255, { message: "Deskripsi maksimal 255 karakter" })
        .optional(),
    
    reference: z
        .string()
        .max(50, { message: "Referensi maksimal 50 karakter" })
        .optional(),
});

const validateDepositRequest = (data) => {
    try {
        const validated = depositRequestSchema.parse(data);

        return {
            message: "Validasi deposit berhasil",
            data: validated,
        };
    } catch (error) {
        throw new AppError("Validasi deposit gagal: " + error.message);
    }
};

module.exports = {
    depositRequestSchema,
    validateDepositRequest,
};