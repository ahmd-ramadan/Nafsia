import { z } from "zod";
import { MongoDBObjectId } from "../utils";

export const addMessageSchema = z.object({
    message: z.string()
    .min(6, 'الرسالة علي الاقل 6 احرف'),
    sessionId: z.string().regex(MongoDBObjectId, 'مَعرف الجلسة غير صحيح')
})

export const updateMessageSchema = z.object({
    message: z.string()
    .min(6, 'الرسالة علي الاقل 6 احرف'),
})