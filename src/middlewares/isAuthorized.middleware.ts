import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { JwtService } from '../services';
import { ApiError, UNAUTHORIZED } from '../utils';
import { AuthenticatedRequest } from '../interfaces';
import { UserRolesEnum } from '../enums';

export const isAuthorized = (allowedRoles: UserRolesEnum[]) => { 
    return asyncHandler(
        async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
            const role = req.user?.role as UserRolesEnum;
            if (!allowedRoles.includes(role)) {
                return next(new ApiError('Unauthorized - Not have access to this', UNAUTHORIZED));
            }
            next();
        },
    )
}