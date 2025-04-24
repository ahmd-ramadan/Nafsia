import { reactService } from '../services';
import {
    CREATED,
    OK,
} from '../utils';
import { AuthenticatedRequest } from '../interfaces';
import { getAllreactsOnPostSchema, reactOnPostSchema } from '../validation';
import { Response } from 'express';

export const reactOnPost = async (req: AuthenticatedRequest, res: Response) => {
    const { reactType, postId } = reactOnPostSchema.parse(req.body);
    const userId = req.user?.userId as string;

    const newReact = await reactService.addReact({ postId, userId, reactType})

    res.status(CREATED).json({ 
        success: true,
        message: 'تم إضافة الريأكت للمنشور  بنجاح!', 
        data: newReact 
    });
};

export const getAllReactsOnPost = async(req: AuthenticatedRequest, res: Response) => {
    const { postId } = getAllreactsOnPostSchema.parse(req.body);

    const allReactsOnPost =  await reactService.getAllReactsOnPost(postId);
    
    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع كل الريأكتس علي المنشور بنجاح!', 
        data: allReactsOnPost 
    });
}

export const changeReactOnPost = async (req: AuthenticatedRequest, res: Response) => {
    const { postId, reactType } = reactOnPostSchema.parse(req.body);
    const userId = req.user?.userId as string;

    const changedReact = await reactService.changeReact({ postId, userId, reactType });

    res.status(OK).json({ 
        success: true,
        message: 'تم تحديث الريأكت بنجاح!', 
        data: changedReact 
    });
};

export const deleteReactOnPost = async (req: AuthenticatedRequest, res: Response) => {
    const { postId } = getAllreactsOnPostSchema.parse(req.body);
    const userId = req.user?.userId as string;

    await reactService.deleteOne({ userId, postId });

    res.status(OK).json({
        success: true,
        message: 'تم إلغاء الريأكت علي المنشور بنجاح',
        data: null
    })
};