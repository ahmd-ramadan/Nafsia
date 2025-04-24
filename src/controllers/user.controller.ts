import { Response } from "express";
import { userService } from "../services";
import { OK } from "../utils";
import { AuthenticatedRequest } from "../interfaces";
import { updateUserPasswordSchema, updateUserProfileSchema } from "../validation";


export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.userId as string;

    const userProfile = await userService.isUserExist(userId)

    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع بيانات المستخدم بنجاح',
        data: userProfile

    });
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.userId as string;
    const data = updateUserProfileSchema.parse(req.body);
    const files = req.files

    const updatedUser = await userService.updateProfile({ userId, data, files })

    res.status(OK).json({ 
        success: true,
        message: 'تم تحديث بيانات المستخدم بنجاح',
        data: updatedUser

    });
};

export const updateUserPassword = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.userId as string;
    const { oldPassword, newPassword } = updateUserPasswordSchema.parse(req.body);

    await userService.updatePassword({ userId, oldPassword, newPassword });

    res.status(OK).json({ 
        success: true,
        message: 'تم تحديث كلمة المرور بنجاح',
    });
};