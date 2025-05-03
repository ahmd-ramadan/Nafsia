import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { addMessageSchema, paramsSchema, updateMessageSchema } from "../validation";
import { messageService } from "../services";
import { CREATED, OK } from "../utils";
import { all } from "axios";

export const createMessage = async (req: AuthenticatedRequest, res: Response) => {
    const { message, sessionId } = addMessageSchema.parse(req.body);
    const doctorId = req.user?.userId as string;

    const newMessage = await messageService.createOne({ message, doctorId, sessionId });

    res.status(CREATED).json({
        success: true,
        message: 'تم إضافة الرسالة بنجاح!', 
        data: newMessage
    });
};

export const getAllMessagesForSessions = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: sessionId } = paramsSchema.parse(req.params);

    const allMessages = await messageService.findAllSessionMessages(sessionId);

    res.status(OK).json({ 
        success: true,
        message: '', 
        data: allMessages 
    });
};


export const updateMessage = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: messageId } = paramsSchema.parse(req.params);
    const { message } = updateMessageSchema.parse(req.body);
    const doctorId = req.user?.userId as string;

    const updatedMessage = await messageService.updateOne({ messageId, doctorId, message });

    res.status(OK).json({ 
        success: true,
        message: 'تم تحديث الرسالة بنجاح!',
        data: updateMessage
    });
};

export const deleteMessage = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: messageId } = paramsSchema.parse(req.params);
    const doctorId = req.user?.userId as string;

    await messageService.deleteOne({ doctorId, messageId });

    res.status(OK).json({
        success: true,
        message: 'تم حذف الرسالة بنجاح',
        data: { messageId }
    })
};