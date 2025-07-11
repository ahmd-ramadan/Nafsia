import { Response } from "express";
import { authService, userService } from "../services";
import { OK } from "../utils";
import { AuthenticatedRequest } from "../interfaces";
import { getAllUsersSchema, getUserProfileSchema, paginationSchema, searchOnDoctorSchema, updateUserPasswordSchema, updateUserProfileSchema } from "../validation";


export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = getUserProfileSchema.parse(req.body)

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

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
    const { role } = getAllUsersSchema.parse(req.query);
    const { pageNumber, pageSize } = paginationSchema.parse(req.query);

    const allUsers = await userService.findAllUsers({ pageNumber, pageSize, role });

    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع جميع المستخدمين المطلوبين بنجاح',
        data: allUsers,
    });
};

export const serchOnDoctor = async (req: AuthenticatedRequest, res: Response) => {
    const { q } = searchOnDoctorSchema.parse(req.query);
    const { pageNumber, pageSize } = paginationSchema.parse(req.query);

    const allDoctors = await userService.searchDoctorsByName({ pageNumber, pageSize, q });

    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع جميع الأخصائيين المطابقين  بنجاح',
        data: allDoctors,
    });
};

