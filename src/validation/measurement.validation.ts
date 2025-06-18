import { z } from "zod";
import { MongoDBObjectId } from "../utils";

export const addMeasurementSchema = z.object({
    gender: z.string(),
    age: z.number().int().positive(),
    occupation: z.string(),
    sleep_duration: z.number(),
    sleep_quality: z.number(),
    bmi_category: z.string(),
    heart_rate: z.number(),
    daily_steps: z.number(),
    systolic_bp: z.number(),
    diastolic_bp: z.number(),
    stress_level: z.number().min(1).max(10).positive()
})

export const getAllMeasurementsForUserSchema = z.object({
    userId: z.string().regex(MongoDBObjectId, 'مّعرف المستخدم غير صحيح'),
})