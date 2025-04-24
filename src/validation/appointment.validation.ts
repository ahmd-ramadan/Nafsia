import { optional, z } from "zod";
import { AppointmentStartTime, MongoDBObjectId } from "../utils";
import { DayOfWeek } from "../enums";

export const createAppointmentSchema = z.object({
    day: z.nativeEnum(DayOfWeek),
    startAtHour: z.string().regex(AppointmentStartTime, "التوقيت غير صحيح اتبع HH:MM"),
    duration: z.number().int().positive(),
    price: z.number().int().positive(),
})

export const updateAppointmentSchema = z.object({
  day: z.nativeEnum(DayOfWeek).optional(),
  startAtHour: z.string().regex(AppointmentStartTime, "التوقيت غير صحيح اتبع HH:MM").optional(),
  duration: z.number().int().positive().optional(),
  price: z.number().int().positive().optional(),
}).refine((data) => {
    return data.day !== undefined ||
            data.startAtHour !== undefined ||
            data.duration !== undefined ||
            data.price !== undefined;
}, {
    message: "ما هي البانات التي تريد تعديلها ؟ ",
    path: [],
});


export const getAllAppointmentsSchema = z.object({
    doctorId: z.string().regex(MongoDBObjectId, "مَعرف الدكتور غير صحيح"),
})