import { z } from "zod";
import { AppointmentStartTime, MongoDBObjectId } from "../utils";
export const createAppointmentSchema = z.object({
    day: z.coerce.date().max(new Date(), "لا يمكن إنشاء موعد في الماضي").transform((date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }),
    schedule: z.array(z.object({
        startAt: z.string().regex(AppointmentStartTime, "التوقيت غير صحيح اتبع HH:MM")
    })),
    duration: z.number().int().positive(),
    price: z.number().int().positive(),
})

export const updateAppointmentSchema = z.object({
    day: z.coerce.date().max(new Date(), "لا يمكن إنشاء موعد في الماضي").optional().transform((date) => {
        if (!date) return undefined;
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }),
  duration: z.number().int().positive().optional(),
  price: z.number().int().positive().optional(),
  schedule: z.array(z.object({
    startAt: z.string().regex(AppointmentStartTime, "التوقيت غير صحيح اتبع HH:MM"),
  })).optional(),
}).refine((data) => {
    return data.day !== undefined ||
            data.duration !== undefined ||
            data.price !== undefined ||
            data.schedule !== undefined;
}, {
    message: "ما هي البانات التي تريد تعديلها ؟ ",
    path: [],
});

export const getAllAppointmentsSchema = z.object({
    doctorId: z.string().regex(MongoDBObjectId, "مَعرف الدكتور غير صحيح").optional(),
    day: z.coerce.date().optional().transform((date) => {
        if (!date) return undefined;
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }),
    price: z.number().int().positive().optional(),
    duration: z.number().int().positive().optional(),
})