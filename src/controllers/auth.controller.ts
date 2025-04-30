import { NextFunction, Request, Response } from "express";
import { authService } from "../services";
import { ApiError, CREATED, OK, UNAUTHORIZED } from "../utils";
import { forgotPasswordSchema, loginSchema, registerSchema, resendVerificationEmailSchema, resetPasswordSchema, verifyEmailSchema, verifyOtpSchema } from "../validation"
import { AuthenticatedRequest } from "../interfaces";


export const register = async (req: Request, res: Response) => {
    const { name, email, password, phone, gender, age, role, specialization } = registerSchema.parse(req.body);
    const files = req.files;
    
    const userInfo = await authService.register({ data: { name, email, password, phone, gender, age, role, specialization }, files });

    res.status(CREATED).json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح ... توجه للإيميل لتأكيد الحساب',
        data: {
            user: userInfo.user,
            token: userInfo.token
        }
    });
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = verifyEmailSchema.parse(req.query);
  
    await authService.verifyEmail(token);
  
    res.status(OK).json({ 
        success: true,
        message: 'تم تفعيل الإيميل بنجاح' 
    });
}

export const resendVerificationEmail = async (req: Request, res: Response) => {
    const { email } = resendVerificationEmailSchema.parse(req.body);
  
    await authService.resendVerificationEmail(email);
  
    res.status(OK).json({ 
        success: true,
        message: 'تم إرسال إيميل التفعيل بنجاح' 
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const userInfo = await authService.login({ email, password });
  
    res.status(OK).json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
         data: {
            user: userInfo.data,
            token: userInfo.tokens.refreshToken
         }
    });
}

export const logout = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.userId as string;
  
    if (!userId) {
        throw new ApiError('Unauthorized - No UserId', UNAUTHORIZED);
    }
  
    const refreshToken = req.body.refreshToken as string;
    if (!refreshToken) {
        throw new ApiError('Unauthorized - Invalid refreshtoken', UNAUTHORIZED);
    }
  
    await authService.logout(refreshToken);
  
    res.status(OK).json({ 
        success: true,
        message: 'تم تسجيل الخروج بنجاح' 
    });
}
  
export const refreshToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError('غير مصرح لك', UNAUTHORIZED));    
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new ApiError('غير مصرح لك ', UNAUTHORIZED));
    }
  
    const tokens = await authService.refreshAccessToken(token);
  
    res.status(OK).json({ 
        success: true,
        message: 'تم تفعيل التوكين بنجاح', 
        tokens 
    });
  
};
  
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);

    await authService.generateOTP(email);

    res.status(OK).json({ 
        success: true,
        message: 'تم إرسال إيميل لإعادة تسجيل كلمة المرور بنجاح'
    });
};
  
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = verifyOtpSchema.parse(req.body);

    await authService.verifyOTP({ email, otp });

    res.status(OK).json({ 
        success: true,
        message: 'تم تأكيد OTP بنجاح' 
    });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { password, otp } = resetPasswordSchema.parse(req.body);

    await authService.resetPassword({ password, otp });

    res.status(OK).json({ 
        success: true,
        message: 'تم إعادة تعيين كلمة المرور بنجاح' 
    });
};