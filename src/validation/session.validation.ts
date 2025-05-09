import { z } from "zod";
import { MongoDBObjectId } from "../utils";
import { SessionStatus, SessionTypes } from "../enums";

export const createPrivateSessionSchema = z.object({
    appointmentId: z.string().regex(MongoDBObjectId, 'مَعرف الموعد غير صحيح'),
    startAtIndex: z.number().int().min(0),
    meetLink: z.string()                //! Add Regex for meet service url
})

export const createCommunitySessionSchema = z.object({
    startAt: z.coerce.date().min(new Date(), 'يجب أن يكون الوقت البدء أكبر من الوقت الحالي'),
    duration: z.number().int().positive(),
    seats: z.number().positive().int(),
    meetLink: z.string(),
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string().regex(MongoDBObjectId, 'مَعرف التصنيف غير صحيح')).optional(),
})

export const confirmPrivateSessionSchema = z.object({
    status: z.enum([SessionStatus.CONFIRMED, SessionStatus.CANCELED])
})

export const getAllSessionsSchema = z.object({
    doctorId: z.string().regex(MongoDBObjectId, "مَعرف الدكتور غير صحيح").optional(),
    userId: z.string().regex(MongoDBObjectId, "مَعرف الدكتور غير صحيح").optional(),
    type: z.nativeEnum(SessionTypes).optional(),
    status: z.nativeEnum(SessionStatus).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string().regex(MongoDBObjectId, 'مَعرف التصنيف غير صحيح')).optional(),
})