import { ICreateMessageQuery, ISession } from "../interfaces";
import { messageRepository } from "../repositories";
import { ApiError, NOT_FOUND, UNAUTHORIZED } from "../utils";
import { sessionService } from "./session.service";

class MessageService {
    constructor(
        private readonly messageDataSource = messageRepository,
    ) {}

    async createOne({ doctorId, message, sessionId }: { doctorId: string, message: string; sessionId: string; }) {
        try {
            const isSessionExist = await sessionService.findSessionById(sessionId) as ISession;
            if (isSessionExist.doctorId.toString() !== doctorId.toString()) {
                throw new ApiError('لا يمكنك إضافة هذه الرسالة في هذه الجلسة', UNAUTHORIZED);
            }
            return this.messageDataSource.createOne({ message, sessionId });
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إضافة الرسالة', UNAUTHORIZED);
        }
    }

    async findAllSessionMessages(sessionId: string) {
        try {
            const isSessionExist = await sessionService.findSessionById(sessionId) as ISession;
            return this.messageDataSource.find({ sessionId });
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إرجاع رسائل الجلسة', UNAUTHORIZED);
        }
    }

    async isMessageExist(messageId: string) {
        const isMessageExist = await this.messageDataSource.findById(messageId);
        if (!isMessageExist) {
            throw new ApiError('الرسالة غير موجود', NOT_FOUND);
        }
        return isMessageExist;
    }

    async updateOne({ doctorId, messageId, message }: { doctorId: string, messageId: string; message: string }) {
        const isMessageExist = await this.isMessageExist(messageId);
        const isSessionExist = await sessionService.isSessionExist(isMessageExist.sessionId) as ISession;
        if (isSessionExist.doctorId.toString() !== doctorId.toString()) {
            throw new ApiError('لا يمكنك تحديث هذه الرسالة من هذه الجلسة', UNAUTHORIZED);
        }
        return this.messageDataSource.updateOne({ _id: messageId }, { message }); 
    }

    async deleteOne({ messageId, doctorId}:{ messageId: string; doctorId: string }) {
        const isMessageExist = await this.isMessageExist(messageId);
        const isSessionExist = await sessionService.isSessionExist(isMessageExist.sessionId) as ISession;
        if (isSessionExist.doctorId.toString() !== doctorId.toString()) {
            throw new ApiError('لا يمكنك حذف هذه الرسالة من هذه الجلسة', UNAUTHORIZED);
        }
        return this.messageDataSource.deleteOne({ _id: messageId });
    }
}

export const messageService = new MessageService();