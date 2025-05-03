import { z } from "zod";
import { MongoDBObjectId } from "../utils";

export const createPostSchema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z
        .any()
        .transform((val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return [val];
        return [];
        })
        .pipe(z.array(z.string()))
})

export const updatePostSchema = z.object({
    title: z.string().optional(),
    content: z.string() .optional(),
    tags: z
        .any()
        .transform((val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return [val];
        return [];
        })
        .pipe(z.array(z.string())).optional(),
    oldPublicIds:  z
        .any()
        .transform((val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return [val];
        return [];
        })
        .pipe(z.array(z.string())).optional(),
})

export const getAllPostsSchema = z.object({
    tags: z.array(z.string()).optional(),
    doctorId: z.string().regex(MongoDBObjectId, "Invalid DoctorId").optional(),
})