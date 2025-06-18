import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { addMeasurementSchema, getAllMeasurementsForUserSchema } from "../validation";
import { measurementService } from "../services";
import { CREATED, OK } from "../utils";

export const createMeasurement = async (req: AuthenticatedRequest, res: Response) => {
    const data = addMeasurementSchema.parse(req.body);
    const userId = req.user?.userId as string;

    const newMeasurement = await measurementService.createOne({ userId, data });

    res.status(CREATED).json({
        success: true,
        message: 'تم إضافة القياسات للمستخدم بنجاح!', 
        data: newMeasurement 
    });
};

export const getAllMeasurementsForUser = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = getAllMeasurementsForUserSchema.parse(req.query);
    
    const measurements = await measurementService.getAllMeasurementsForUser({ userId });
 
    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع كل القياسات بنجاح', 
        data: measurements 
    });
};