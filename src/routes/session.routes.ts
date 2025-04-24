import { Router } from 'express';
import { sessionCtrl } from '../controllers';
import { isAuthorized, isAuthunticated } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { accessToSession, getSession, manageSession } from '../access';

const router = Router();

// Community Sessions
router.post(
    '/community-session',
    isAuthunticated,
    isAuthorized(manageSession),
    asyncHandler(sessionCtrl.craeteCommunitySession)
)

router.patch(
    '/community-session/:_id/participate',
    isAuthunticated,
    isAuthorized(accessToSession),
    asyncHandler(sessionCtrl.participateInCommunitySession)
)

// Private Sessions
router.post(
    '/private-session',
    isAuthunticated,
    isAuthorized(accessToSession),
    asyncHandler(sessionCtrl.craetePrivateSession)
)

router.patch(
    '/private-session/:_id/confirm',
    isAuthunticated,
    isAuthorized(manageSession),
    asyncHandler(sessionCtrl.confirmedPrivateSession)
)

// General Sessions
router.get(
    '/',
    isAuthunticated,
    isAuthorized(getSession),
    asyncHandler(sessionCtrl.getAllSessions)
)

router.patch(
    '/:_id/complete',
    isAuthunticated,
    isAuthorized(manageSession),
    asyncHandler(sessionCtrl.completeSession)
)


export { router as sessionRouter };