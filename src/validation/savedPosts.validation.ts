import { z } from 'zod';
import { MongoDBObjectId } from '../utils';

export const toSavedPostsSchema = z.object({
    postId: z.string().regex(MongoDBObjectId, 'معرف المنشور غير صحيح'),
})