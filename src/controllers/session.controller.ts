import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { confirmPrivateSessionSchema, createCommunitySessionSchema, createPrivateSessionSchema, getAllSessionsSchema, paginationSchema, paramsSchema } from "../validation";
import { sessionService } from "../services";
import { CREATED, OK } from "../utils";
import { SessionStatus } from "../enums";


export const craetePrivateSession = async(req: AuthenticatedRequest, res: Response) => {
    const { startAt, meetLink, appointmentId } = createPrivateSessionSchema.parse(req.body);
    const userId = req?.user?.userId as string;

    const newSession = await sessionService.createPrivateSession({
        participations: [ userId ],
        appointmentId,
        meetLink,
        startAt
    })

    res.status(CREATED).json({
        success: true,
        message: 'تم حجز الجلسة بنجاح',
        data: newSession
    })
}

export const confirmedPrivateSession = async(req: AuthenticatedRequest, res: Response) => {
    const { _id: sessionId } = paramsSchema.parse(req.params);
    const { status } = confirmPrivateSessionSchema.parse(req.query);
    const doctorId = req?.user?.userId as string;

    const confirmedSession = await sessionService.confirmSessionByDoctor({
        doctorId,
        sessionId,
        status
    })

    const resText = status === SessionStatus.CONFIRMED ? 'تأكيد' : 'رفض';
    
    res.status(OK).json({
        success: true,
        message: `تم ${resText} حجز الجلسة بنجاح`,
        data: confirmedSession
    })
}

export const craeteCommunitySession = async(req: AuthenticatedRequest, res: Response) => {
    const { duration, price, startAt, meetLink, seats } = createCommunitySessionSchema.parse(req.body);

    const doctorId = req?.user?.userId as string;

    const newSession = await sessionService.createCommuintySession({
        doctorId,
        participations: [],
        duration,
        meetLink,
        price,
        startAt,
        seats
    })

    res.status(CREATED).json({
        success: true,
        message: 'تم إنشاء الجلسة بنجاح',
        data: newSession
    })
}

export const participateInCommunitySession = async(req: AuthenticatedRequest, res: Response) => {
    const { _id: sessionId } = paramsSchema.parse(req.params);
    const userId = req?.user?.userId as string;

    const updatedSession = await sessionService.userParticipateInCommunitySession({ userId, sessionId })

    res.status(OK).json({
        success: true,
        message: 'تم الإشتراك الجلسة بنجاح',
        data: updatedSession
    })
}

export const completeSession = async(req: AuthenticatedRequest, res: Response) => {
    const { _id: sessionId } = paramsSchema.parse(req.params);
    const doctorId = req?.user?.userId as string;

    const completedSession = await sessionService.completedSessionByDoctor({ doctorId, sessionId })

    res.status(OK).json({
        success: true,
        message: 'تم إجراء الجلسة بنجاح',
        data: completedSession
    })
}

export const getAllSessions = async(req: AuthenticatedRequest, res: Response) => {
    const data = getAllSessionsSchema.parse(req.query);
    const { pageNumber, pageSize } = paginationSchema.parse(req.query);
    const doctorId = req?.user?.userId as string;

    const allSessions = await sessionService.getAllSessions({ ...data, pageNumber, pageSize })

    res.status(OK).json({
        success: true,
        message: 'تم إرحاع جميع الجلسات المطلوبة بنجاح',
        data: allSessions
    })
}