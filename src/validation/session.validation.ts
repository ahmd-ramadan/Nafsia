import { z } from "zod";
import { MongoDBObjectId } from "../utils";
import { SessionStatus } from "../enums";

export const createPrivateSessionSchema = z.object({
    appointmentId: z.string().regex(MongoDBObjectId, 'مَعرف الموعد غير صحيح'),
    startAt: z.coerce.date(),
    meetLink: z.string()                //! Add Regex for meet service url
})

export const createCommunitySessionSchema = z.object({
    startAt: z.coerce.date(),
    duration: z.number().int().positive(),
    price: z.number().int().positive(),
    seats: z.number().positive().int(),
    meetLink: z.string()
})

export const confirmPrivateSessionSchema = z.object({
    status: z.enum([SessionStatus.CONFIRMED, SessionStatus.CANCELED])
})

export const getAllSessionsSchema = z.object({
    doctorId: z.string().regex(MongoDBObjectId, "مَعرف الدكتور غير صحيح").optional(),
    userId: z.string().regex(MongoDBObjectId, "مَعرف الدكتور غير صحيح").optional(),
    type: z.nativeEnum(SessionStatus).optional(),
    status: z.nativeEnum(SessionStatus).optional(),
})