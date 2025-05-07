import { z } from "zod";
import { UserRolesEnum } from "../enums";

export const updateUserProfileSchema = z
.object({
    name: z.coerce.string().min(3, 'Name must be at least 3 characters').trim().optional(),
    phone: z
        .coerce
        .string()
        .regex(
            /^(?:\+20|0)?(10|11|12|15)\d{8}$/,
            'Invalid Egyptian phone number format',
        )
        .trim().optional(),
    age: z.coerce.number().optional(),
    specialization: z.coerce.string().optional(),
    description: z.coerce.string().optional(),
})

export const updateUserPasswordSchema = z
.object({
    oldPassword: z
            .string()
            .regex(
                /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[A-Za-z]).{8,}$/,
                'Password: 8+ chars, 1 number, 1 special, 1 lowercase or uppercase',
            )
            .trim(),
    newPassword: z
            .string()
            .regex(
                /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[A-Za-z]).{8,}$/,
                'Password: 8+ chars, 1 number, 1 special, 1 lowercase or uppercase',
            )
            .trim(),
})

export const getAllUsersSchema = z.object({
    role: z.nativeEnum(UserRolesEnum).optional(),
})

export const searchOnDoctorSchema = z.object({
    q: z.string(),
})