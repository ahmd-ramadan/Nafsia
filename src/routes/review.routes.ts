import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { reviewCtrl } from '../controllers';
import { isAuthorized, isAuthunticated } from '../middlewares';
import { manageReview } from '../access';

const router = Router();

router.route('/')
    .post(
        isAuthunticated,
        isAuthorized(manageReview),
        asyncHandler(reviewCtrl.addReview)
    )
    .get(
        asyncHandler(reviewCtrl.getAllReviews)
    )

router.route('/:_id')
    .patch(
        isAuthunticated,
        isAuthorized(manageReview),
        asyncHandler(reviewCtrl.updateReview)
    )
    .delete(
        isAuthunticated,
        isAuthorized(manageReview),
        asyncHandler(reviewCtrl.deleteReview)
    )



export { router as reviewRouter };