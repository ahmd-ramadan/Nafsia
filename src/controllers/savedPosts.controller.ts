import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { savedPostsService } from "../services";
import { CREATED, OK } from "../utils";
import { toSavedPostsSchema } from "../validation";

export const addPostToSavedPosts = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { postId } = toSavedPostsSchema.parse(req.body);

    const savedPosts = await savedPostsService.addPostToSavePosts({ userId, postId });

    res.status(CREATED).json({
        success: true,
        message: 'تم حفظ المنشور بنجاح',
        data: savedPosts
    });
};

export const deletePostFromSavedPosts = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { postId } = toSavedPostsSchema.parse(req.body);
   
    const savedPosts = await savedPostsService.deletePostFromSavedPosts({ userId, postId });

    res.status(OK).json({
        success: true,
        message: 'تم حذف المنشور من المحفوظات بنجاح',
        data: savedPosts,
    });
};

export const deleteAllPostsFromSavedPosts = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId as string;
   
    const savedPosts = await savedPostsService.deleteAllPostsFromSavedPosts(userId);

    res.status(OK).json({
        success: true,
        message: 'تم حذف جميع المنشور من المحفوظات بنجاح',
        data: savedPosts,
    });
};

export const getUserSavedPosts = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const savedPosts = await savedPostsService.findSavedPostsByUserId(userId);

    res.status(OK).json({
        success: true,
        message: '',
        data: savedPosts,
    });
};