import { ICloudinaryIMage, ICreateUserQuery, IDoctor, IUser } from "../interfaces";
import { ApiError, BAD_REQUEST, CONFLICT, FORBIDDEN, generateCode, GONE, INTERNAL_SERVER_ERROR, logger, MAGIC_NUMBERS, NOT_FOUND, UNAUTHORIZED } from "../utils";
import { BaseAuthService } from "./authBase.service";
import { HashingService } from "./hashing.service";
import { userService } from "./user.service";
import { emailService } from "./email.service";
import { JwtService } from "./jwt.service";
import { tokenService } from "./token.service";
import { TokenTypesEnum } from "../enums/token.enums";
import { otpService } from "./otp.service";
import { UserRolesEnum } from "../enums";
import { doctorService } from "./doctor.service";
import { cloudinaryService } from "./cloudinary.service";
import { cloudinaryAvatarsFolder, cloudinaryLicensesFolder } from "../config";


class AuthService extends BaseAuthService {
    
    async register(
       { data : { name, email, password, phone, age, gender, role, specialization }, files } : { data: ICreateUserQuery, files: any } 
    ) {
        try {
            const userExists = await userService.findUserByEmail(email);
        
            if (userExists) {
                throw new ApiError('المستخدم موجود بالفعل', CONFLICT);
            }
    
            const hashedPassword = await HashingService.hash(password);
            
            
            const userCredentials: ICreateUserQuery = { name, email, password: hashedPassword, phone, age, gender, role, specialization };
            if(files && files.length ) {
                const { secure_url, public_id } = await cloudinaryService.uploadImage({
                    fileToUpload: files[0].path,
                    folderPath: cloudinaryAvatarsFolder
                })
                userCredentials.avatar = { secure_url, public_id };
            }
            if(files && files.length > 1 ) {
                const { secure_url, public_id } = await cloudinaryService.uploadImage({
                    fileToUpload: files[1].path,
                    folderPath: cloudinaryLicensesFolder
                })
                userCredentials.medicalLicense = { secure_url, public_id };
            }
            const user = await this.createNewUser(userCredentials) as IUser;
            const token = (await this.generateAndStoreTokens(user)).refreshToken;
    
            await this.sendVerificationEmail(user);
    
            return { 
                user, 
                token
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية إنشاء الحساب', INTERNAL_SERVER_ERROR);
        }
    }

    private async createNewUser(data: ICreateUserQuery) {
        if ( data.role === UserRolesEnum.DOCTOR) {
            const { specialization, medicalLicense } = data;
            if (!specialization || !medicalLicense) {
                throw new ApiError('تخصص الدكتور مطلوب', BAD_REQUEST)
            }

            let user = await userService.createNewUser(data) as IUser
            const doctor = await doctorService.createNewDoctor({ specialization, medicalLicense, userId: user?._id }) as IDoctor; 

            if (!user || !doctor) {
                throw new ApiError('فشل عملية إنشاء الحساب', BAD_REQUEST)
            }
           
            return this.formatUserResponse({ user, hasPassword: true });
        } else {
            const user = await userService.createNewUser(data) as IUser;
            return await this.formatUserResponse({ user, hasPassword: true }) 
        }
    }

    private async sendVerificationEmail(user: any) {
        const { _id: userId, role } = user;
        const verificationToken = JwtService.generateAccessToken(
          { userId, role },
          24 * 60 * 60,
        );

        await tokenService.createOne({
            userId,
            token: verificationToken,
            expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_DAY_IN_MILLISECONDS),
            type: TokenTypesEnum.ACTIVATION
        })
    
        emailService.sendVerificationEmail({
            email: user.email,
            name: user.name,
            token: verificationToken,
        });
    }

    async verifyEmail(token: string) {
        try {
            const decoded = JwtService.verify(token, 'access');

            if (!decoded) {
                throw new ApiError('التوكين غير صحيح', UNAUTHORIZED);
            }
    
            const user = await userService.findUserById(decoded.userId as string);
            if (!user) {
                throw new ApiError('المستخدم غير موجود', NOT_FOUND);
            }

            const storedActivationToken = await tokenService.findOne({ 
                userId: user?._id,
                token: token,
                type: TokenTypesEnum.ACTIVATION,
                expiresAt: { $gt: new Date() }
            });
            if (!storedActivationToken) {
                throw new ApiError('توكين التفعيل غير صحيح او منتهي الصلاحية', GONE);
            }
    
            await Promise.all([
                userService.updateOne({ userId: user._id, data: { isVerified: true } }),
                tokenService.deleteOne({ _id: storedActivationToken._id })
            ]);
        } catch (error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية تفعيل الحساب', INTERNAL_SERVER_ERROR)
        }
    }

    async resendVerificationEmail(email: string) {
        try {
            const user = await userService.findUserByEmail(email);
    
            if (!user) {
                throw new ApiError('المستخدم غير موجود', NOT_FOUND);
            }
    
            if (user.isVerified) {
                throw new ApiError('الإيميل مَفعل بالفعل', CONFLICT);
            }
    
            const isTokenExists = await tokenService.findOne({ userId: user?._id, type: TokenTypesEnum.ACTIVATION });
            if (isTokenExists) {
                await tokenService.deleteOne({ _id: isTokenExists._id });
            }
    
            const userResponse = await this.formatUserResponse({
                user,
                hasPassword: user.password ? true : false,
            });
            await this.sendVerificationEmail(user);
        } catch (error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية إرسال إيميل لتفعيل الحساب', INTERNAL_SERVER_ERROR)
        }
    }

    async login({ email, password }: { email: string, password: string }) {
        try {
            const user = await userService.findUserByEmail(email);
    
            if (!user || !user.password) {
                throw new ApiError('البريد الإلكتروني أو كلمة المرور غير صحيحة', UNAUTHORIZED);
            }
    
            const passwordMatches = await HashingService.compare(
                password,
                user?.password,
            );
    
            if (!passwordMatches) {
                throw new ApiError('البريد الإلكتروني أو كلمة المرور غير صحيحة', UNAUTHORIZED);
            }
    
            if (!user.isVerified) {
                throw new ApiError(
                    ' الحساب غير مَفعل. من فضلك افحص إيميلك',
                    FORBIDDEN,
                );
            }
    
            const tokens = await this.generateAndStoreTokens(user);
            const userResponse = await this.formatUserResponse({
                user,
                hasPassword: true,
            });
    
            return { data: userResponse, tokens };
        } catch (error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية تسجيل الدخول', INTERNAL_SERVER_ERROR);
        }
    }

    async logout(refreshToken: string) {
        try {
            const storedToken =
                await tokenService.tokenExists(refreshToken);
        
            if (!storedToken) {
                throw new ApiError('غير مَصرح لك', UNAUTHORIZED);
            }
        
            await tokenService.deleteOne({ token: refreshToken });
        } catch (error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية تسجيل الخروج', INTERNAL_SERVER_ERROR)
        }
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const payload = JwtService.verify(refreshToken, 'refresh');
    
            if (!payload) {
                throw new ApiError('غير مَصرح لك', UNAUTHORIZED);
            }
    
            const user = await userService.findUserById(payload.userId as string);
            const storedToken =
            await tokenService.tokenExists(refreshToken);
    
            if (!user || !storedToken) {
                throw new ApiError('غير مضرح لك', UNAUTHORIZED);
            }
    
            // await tokenService.deleteOne({ token: refreshToken });
            // return await this.generateAndStoreTokens(payload.id as string);
            return JwtService.generateAccessToken(payload);
        } catch (error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية إعادة تفعيل التوكين', INTERNAL_SERVER_ERROR)
        }
    }   

    async generateOTP(email: string) {
        try {
            const user = await userService.findUserByEmail(email);
    
            if (user) {
                const otp = generateCode();
                await this.storeAndSendOTP({ user, otp });
            }
        } catch (error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية إنشاء OTP', INTERNAL_SERVER_ERROR)
        }
    }

    private async storeAndSendOTP({ user, otp }: { user: IUser, otp: string }) {
        await Promise.all([
            otpService.createOne({
                otp,
                userId: user._id,
                expiresAt: new Date(
                    Date.now() + MAGIC_NUMBERS.FIFTEEN_MINUTES_IN_MILLISECONDS,
                ),
            })
        ]);
    
        emailService.sendForgetPasswordEmail({ email: user.email, name: user.name, otp: otp });
    }

    async verifyOTP({email, otp }: { email: string, otp: string }) {
        try {
            const user = await userService.findUserByEmail(email);
    
            if (!user) {
                throw new ApiError('المستخدم غير موجود', NOT_FOUND);
            }
    
            const storedOTP = await otpService.findOne({ otp, userId: user._id, expiresAt: { $gt: new Date() }});
    
            if (!storedOTP || storedOTP.otp.toString().trim() !== otp.toString().trim()) {
                throw new ApiError('OTP غير صحيح أو منتهي الصلاحية', GONE);
            }

        } catch (error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية تأكيد الOTP', INTERNAL_SERVER_ERROR)
        }
    }

    async resetPassword({ password, otp }: { password: string, otp: string }) {
        try {
            const otpExist = await otpService.findOne({ otp, expiresAt: { $gt: new Date() } });
            if (! otpExist) {
                throw new ApiError('OTP غير صحيح أو منتهي الصلاحية', GONE)
            }

            const { userId } = otpExist;
            const userExist = await userService.findUserById(userId);
            if (!userExist) {
                throw new ApiError('المستخدم غير موجود', NOT_FOUND)
            }

            const hashedPassword = await HashingService.hash(password);
            await Promise.all([
                otpService.deleteOne({ otp, userId }),
                userService.updateOne({ userId, data: { password: hashedPassword } }),
                tokenService.deleteMany({ userId }),
            ]);
        } catch(error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية إعادة تعيين كلمة المرور', INTERNAL_SERVER_ERROR)
        }
    }
}

export const authService = new AuthService();