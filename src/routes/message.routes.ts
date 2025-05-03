import { Router } from 'express';
import { messageCtrl } from '../controllers';
import { isAuthorized, isAuthunticated, multerMiddleHost } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { manageMessageAccess } from '../access';
const router = Router();

router.route('/')
    .post(
        isAuthunticated, 
        isAuthorized(manageMessageAccess),
        asyncHandler(messageCtrl.createMessage)
    )
    

router.route('/:_id')
    .get(
        messageCtrl.getAllMessagesForSessions
    )
    .patch(
        isAuthunticated,
        isAuthorized(manageMessageAccess),
        asyncHandler(messageCtrl.updateMessage)
    )
    .delete(
        isAuthunticated,
        isAuthorized(manageMessageAccess),
        asyncHandler(messageCtrl.deleteMessage)
    );

export { router as messageRouter };