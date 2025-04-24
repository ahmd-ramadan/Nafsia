import { z } from "zod";
import { MongoDBObjectId } from "../utils";

export const addReviewSchema = z.object({
    doctorId: z.string().regex(MongoDBObjectId, 'مَعرف الدكتور غير صحيح'),
    rating: z.number().int().positive().min(1).max(5),
    comment: z.string().optional()
})

export const updateReviewSchema = z.object({
    rating: z.number().int().positive().min(1).max(5).optional(),
    comment: z.string().optional()
})

export const getAllReviewsQuerySchema = z.object({
    doctorId: z.string().regex(MongoDBObjectId, 'مَعرف الدكتور غير صحيح').optional(),
    userId: z.string().regex(MongoDBObjectId, 'مَعرف المستخدم غير صحيح').optional(),
})