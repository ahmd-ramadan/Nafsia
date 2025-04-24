import { z } from "zod";

export const toTagSchema = z.object({
    name: z.string()
    .min(3, 'الوسم علي الاقل 3 احرف')
    .max(30, 'علي الأكثر يتكون الوسم من 30 حرف')
})