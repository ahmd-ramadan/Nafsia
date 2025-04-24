import { Router } from 'express';
import { tagCtrl } from '../controllers';
import { isAuthorized, isAuthunticated } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { manageTag } from '../access';
const router = Router();

router.route('/')
    .post(
        isAuthunticated, 
        isAuthorized(manageTag),
        asyncHandler(tagCtrl.createTag)
    )
    .get(
        tagCtrl.getAllTags
    );

router.route('/:_id')
    .get(
        tagCtrl.getTag
    )
    .patch(
        isAuthunticated,
        isAuthorized(manageTag),
        asyncHandler(tagCtrl.updateTag)
    )
    .delete(
        isAuthunticated,
        isAuthorized(manageTag),
        asyncHandler(tagCtrl.deleteTag)
    );

export { router as tagRouter };