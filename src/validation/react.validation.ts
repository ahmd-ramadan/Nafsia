import { z } from "zod";
import { MongoDBObjectId } from "../utils";
import { ReactTypesEnum } from "../enums/react.enums";

export const reactOnPostSchema = z.object({
    postId: z.string().regex(MongoDBObjectId, 'مّعرف المنشور غير صحيح'),
    reactType: z.nativeEnum(ReactTypesEnum)
})

export const getAllreactsOnPostSchema = z.object({
    postId: z.string().regex(MongoDBObjectId, 'مّعرف المنشور غير صحيح'),
})