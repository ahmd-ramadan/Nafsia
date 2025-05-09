import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { createAppointmentSchema, getAllAppointmentsSchema, paginationSchema, updateAppointmentSchema } from "../validation/";
import { appointmentService } from "../services";
import { CREATED, OK } from "../utils";
import { paramsSchema } from "../validation";

export const createAppointment = async (req: AuthenticatedRequest, res: Response) => {
    const data = createAppointmentSchema.parse(req.body);
    const doctorId = req?.user?.userId as string;

    const newAppointment = await appointmentService.createNewAppointment({ ... data, doctorId });
    
    res.status(CREATED).json({ 
        success: true,
        message: 'تم إضافة موعد جديد بنجاح!', 
        data: newAppointment
    });
};

export const updateAppointment = async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = req?.user?.userId as string;
    const { _id: appointmentId } = paramsSchema.parse(req.params);
    const data = updateAppointmentSchema.parse(req.body);

    const updatedAppointment = await appointmentService.updateAppointment({ appointmentId, data: { ... data, doctorId } });

    res.status(OK).json({ 
        success: true,
        message: 'تم تحديث الموعد بنجاح', 
        data: updatedAppointment 
    });
};

export const deleteAppointment = async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = req?.user?.userId as string;
    const { _id: appointmentId } = paramsSchema.parse(req.params);

    await appointmentService.deleteAppointment({ appointmentId, doctorId });

    res.status(OK).json({ 
        success: true,
        message: 'تم حذف الموعد بنجاح', 
        data: { appointmentId } 
    });
};

export const getAllAppointments = async(req: Request, res: Response) => {
    const { doctorId, day, duration, price } = getAllAppointmentsSchema.parse(req.query);
    const { pageNumber, pageSize } = paginationSchema.parse(req.query);

    const appointments =  await appointmentService.findMany({ doctorId, day, duration, price, pageNumber, pageSize });
    
    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع كل المواعيد المطلوبة', 
        data: appointments 
    });
}

export const getAppointmentById = async (req: Request, res: Response) => {
    const { _id: appointmentId } = paramsSchema.parse(req.params);

    const appointment = await appointmentService.findOne({ _id: appointmentId });
    
    res.status(OK).json({ 
        success: true,
        message: 'تم إرجاع الموعد بنجاح', 
        data: appointment 
    });
}

