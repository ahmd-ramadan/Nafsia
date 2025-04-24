import { Router } from 'express';
import { postCtrl } from '../controllers';
import { isAuthorized, isAuthunticated, multerMiddleHost } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { managePostAccess } from '../access';
const router = Router();

router.route('/')
    .post(
        isAuthunticated, 
        isAuthorized(managePostAccess),
        multerMiddleHost({}).array("image", 4),
        asyncHandler(postCtrl.createPost)
    )
    .get(
        postCtrl.getAllPosts
    );

router.route('/:_id')
    .get(
        postCtrl.getPost
    )
    .patch(
        isAuthunticated,
        isAuthorized(managePostAccess),
        multerMiddleHost({}).array("image", 4),
        asyncHandler(postCtrl.updatePost)
    )
    .delete(
        isAuthunticated,
        isAuthorized(managePostAccess),
        asyncHandler(postCtrl.deletePost)
    );

export { router as postRouter };