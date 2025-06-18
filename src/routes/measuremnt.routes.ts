import { Router } from 'express';
import { measurementCtrl } from '../controllers';
import { isAuthorized, isAuthunticated } from '../middlewares';
import asyncHandler from 'express-async-handler'
import { manageMeasurement } from '../access';
const router = Router();

router.route('/')
    .post(
        isAuthunticated, 
        isAuthorized(manageMeasurement),
        asyncHandler(measurementCtrl.createMeasurement)
    )
    .get(
        isAuthunticated,
        isAuthorized(manageMeasurement),
        asyncHandler(measurementCtrl.getAllMeasurementsForUser)
    );

export { router as measurementRouter };