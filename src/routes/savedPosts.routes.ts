import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { savedPostsCtrl } from '../controllers';
import { isAuthorized, isAuthunticated } from '../middlewares';
import { manageSavedPosts } from '../access';

const router = Router();

router.use(
    isAuthunticated,
    isAuthorized(manageSavedPosts)
);

router.route('/')
    .post(
        asyncHandler(savedPostsCtrl.addPostToSavedPosts)
    )
    .get(
        asyncHandler(savedPostsCtrl.getUserSavedPosts)
    )
    .delete (
        asyncHandler(savedPostsCtrl.deletePostFromSavedPosts)
    )

router.delete(
    '/all-posts',
    asyncHandler(savedPostsCtrl.deleteAllPostsFromSavedPosts)
)

export { router as savedPostsRouter };