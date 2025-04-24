import { coerce, z } from 'zod';
import { UserGender, UserRolesEnum } from '../enums';

export const registerSchema = z
    .object({
        name: z.coerce.string().min(3, 'Name must be at least 3 characters').trim(),
        email: z.coerce.string().email('Invalid email format').toLowerCase().trim(),
        phone: z
            .coerce
            .string()
            .regex(
                /^(?:\+20|0)?(10|11|12|15)\d{8}$/,
                'Invalid Egyptian phone number format',
            )
            .trim(),
        password: z
            .coerce
            .string()
            .regex(
                /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[A-Za-z]).{8,}$/,
                'Password: 8+ chars, 1 number, 1 special, 1 lowercase or uppercase',
            )
            .trim(),
        role: z.nativeEnum(UserRolesEnum),
        age: z.coerce.number().optional(),
        gender: z.nativeEnum(UserGender).optional(),
        specialization: z.coerce.string().optional(),
    })
    .refine((data) => {
        if (data.role === UserRolesEnum.DOCTOR) {
            return data.age !== undefined && data.gender !== undefined && data.specialization;
        }
        return true;
    }, {
        message: 'Doctors must provide age, gender, and specialization',
        path: ['role'],
    });


export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().regex(
    /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[A-Za-z]).{8,}$/,
    'Password: 8+ chars, 1 number, 1 special, 1 lowercase or uppercase',
  ),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim(),
});

export const resendVerificationEmailSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  otp: z.string().length(6, 'Invalid OTP').trim(),
});

export const resetPasswordSchema = z.object({
  password: z.string().regex(
    /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[A-Za-z]).{8,}$/,
    'Password: 8+ chars, 1 number, 1 special, 1 lowercase or uppercase',
  ),
  otp: z.string().length(6, 'Invalid OTP').trim(),
});