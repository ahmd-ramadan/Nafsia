import { Router } from 'express';
import { reactCtrl } from '../controllers';
import { isAuthorized, isAuthunticated } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { manageReact } from '../access';

const router = Router();

router.route('/')
    .post(
        isAuthunticated, 
        isAuthorized(manageReact),
        asyncHandler(reactCtrl.reactOnPost)
    )
    .patch(
        isAuthunticated,
        isAuthorized(manageReact),
        asyncHandler(reactCtrl.changeReactOnPost)
    )
    .delete(
        isAuthunticated,
        isAuthorized(manageReact),
        asyncHandler(reactCtrl.deleteReactOnPost)
    )
    .get(
        reactCtrl.getAllReactsOnPost
    );

export { router as reactRouter };