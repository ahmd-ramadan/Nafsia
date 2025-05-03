import { Router } from 'express'
import { authRouter } from './auth.routes';
import { tagRouter } from './tag.routes';
import { postRouter } from './post.routes';
import { appointmentRouter } from './appointment.routes';
import { sessionRouter } from './session.routes';
import { reviewRouter } from './review.routes';
import { savedPostsRouter } from './savedPosts.routes';
import { reactRouter } from './react.routes';
import { userRouter } from './user.routes';
import { messageRouter } from './message.routes';

const router = Router();

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/tag', tagRouter)
router.use('/post', postRouter)
router.use('/react', reactRouter)
router.use('/appointment', appointmentRouter)
router.use('/session', sessionRouter)
router.use('/review', reviewRouter)
router.use('/saved-posts', savedPostsRouter)
router.use('/message', messageRouter)

export default router;