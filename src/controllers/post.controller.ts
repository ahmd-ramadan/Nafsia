import { postService } from '../services';
import {
    CREATED,
    NO_CONTENT,
    OK,
} from '../utils';
import { AuthenticatedRequest } from '../interfaces';
import { createPostSchema, getAllPostsSchema, paramsSchema, updatePostSchema } from '../validation';
import { Response } from 'express';

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
    const { title, content, tags } = createPostSchema.parse(req.body);
    const files = req.files;
    const newPost = await postService.createOne({ data: {
        tags,
        title,
        content,
        doctorId: req?.user?.userId as string,
        images: []
    }, files });

    res.status(CREATED).json({ 
        success: true,
        message: 'تم إنشاء المنشور بنجاح!', 
        data: newPost 
    });
};

export const getPost = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: postId } = paramsSchema.parse(req.params);

    const post = await postService.isPostExist(postId);

    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع المنشور بنجاح', 
        data: post 
    });
};

export const getAllPosts = async(req: AuthenticatedRequest, res: Response) => {
    const { doctorId, tags } = getAllPostsSchema.parse(req.query);
    const allPosts =  await postService.findMany({ doctorId, tags });
    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع المنشورات المطلوبة بنجاح!', 
        data: allPosts 
    });
}

export const updatePost = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: postId } = paramsSchema.parse(req.params);
    const { content, tags, title, oldPublicIds } = updatePostSchema.parse(req.body);

    const doctorId = req.user?.userId as string;

    const files = req.files;

    const updatedPost = await postService.updateOne({ postId, doctorId, data: { content, tags, title, oldPublicIds }, files });

    res.status(OK).json({ 
        success: true,
        message: 'تم تحديث المنشور بنجاح!', 
        data: updatedPost 
    });
};

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: postId } = paramsSchema.parse(req.params);
    const doctorId = req.user?.userId as string;

    await postService.deletePostById({ doctorId, postId });

    res.status(OK).json({
        success: true,
        message: 'تم حذف المنشور بنجاح',
        data: { postId }
    })
};