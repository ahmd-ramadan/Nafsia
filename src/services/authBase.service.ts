import { IUser } from "../interfaces";
import { MAGIC_NUMBERS } from "../utils";
import { tokenService } from "./token.service";
import { JwtService } from "./jwt.service";
import { UserRolesEnum } from "../enums";
import { userService } from "./user.service";
export abstract class BaseAuthService {

    protected async generateAndStoreTokens(user: IUser) {
        const { _id: userId, role } = user;
        const tokens = JwtService.generateTokens(user);
        await tokenService.createOne({
            token: tokens.refreshToken,
            userId,
            expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
        });

        return tokens;
    }

    protected async formatUserResponse({ user, hasPassword = false }: { user: IUser, hasPassword?: boolean }) {
        if (user.role === UserRolesEnum.DOCTOR) {
            return await userService.findDoctorUser(user._id);
        }
        return user; 
    }
}