import { Router } from 'express';
import { appointmantCtrl } from '../controllers';
import { isAuthorized, isAuthunticated } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { manageAppointment } from '../access';
const router = Router();

router.route('/')
    .post(
        isAuthunticated, 
        isAuthorized(manageAppointment),
        asyncHandler(appointmantCtrl.createAppointment)
    )
    .get(
        appointmantCtrl.getAllAppointments
    );

router.route('/:_id')
    .patch(
        isAuthunticated,
        isAuthorized(manageAppointment),
        asyncHandler(appointmantCtrl.updateAppointment)
    )
    .delete(
        isAuthunticated,
        isAuthorized(manageAppointment),
        asyncHandler(appointmantCtrl.deleteAppointment)
    )
    .get(
        asyncHandler(appointmantCtrl.getAppointmentById)
    );

export { router as appointmentRouter };