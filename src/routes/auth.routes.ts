import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authCtrl } from '../controllers';
import { isAuthunticated, multerMiddleHost, oneMinuteLimiter, twentyFourHourLimiter } from '../middlewares';

const router = Router();

// router.post('/google/callback', asyncHandler(authCtrl.handleGoogleCallback));

router.post(
    '/register',
    multerMiddleHost({}).fields([
        { name: "avatar", maxCount: 1 },
        { name: "medicalLicense", maxCount: 1 }
    ]),
    asyncHandler(authCtrl.register)
)
router.get('/verify-email', asyncHandler(authCtrl.verifyEmail));
router.post('/login', asyncHandler(authCtrl.login));
router.post('/logout', isAuthunticated, asyncHandler(authCtrl.logout));
router.post('/refresh-token', asyncHandler(authCtrl.refreshToken));
router.post('/verify-otp', asyncHandler(authCtrl.verifyOtp));
router.post('/reset-password', asyncHandler(authCtrl.resetPassword));

router.post(
    '/resend-verify-email',
    oneMinuteLimiter,
    twentyFourHourLimiter,
    asyncHandler(authCtrl.resendVerificationEmail),
);
router.post(
    '/forgot-password',
    oneMinuteLimiter,
    twentyFourHourLimiter,
    asyncHandler(authCtrl.forgotPassword)
);

export { router as authRouter };