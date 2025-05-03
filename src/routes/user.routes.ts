import { Router } from 'express';
import { userCtrl } from '../controllers';
import { isAuthorized, isAuthunticated, multerMiddleHost } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { manageUser } from '../access';
const router = Router();

router.route('/')
    .get(
        isAuthunticated, 
        isAuthorized(manageUser),
        asyncHandler(userCtrl.getUserProfile)
    )
    .put(
        isAuthunticated, 
        isAuthorized(manageUser),
        asyncHandler(userCtrl.updateUserPassword)
    )
    .patch(
        isAuthunticated,
        isAuthorized(manageUser),
        multerMiddleHost({}).array("image", 1),
        asyncHandler(userCtrl.updateUserProfile)
    )

router.get(
    '/all',
    asyncHandler(userCtrl.getAllUsers)
)
router.get(
    '/search',
    asyncHandler(userCtrl.serchOnDoctor)
)

export { router as userRouter };