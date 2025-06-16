import { SessionStatus, SessionTypes } from "../enums";
import { IAppointmentModel, ICreateCommunitySessionQuery, ICreatePrivateSessionQuery, ISessionModel } from "../interfaces";
import { sessionRepository } from "../repositories";
import { ApiError, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, pagenation, UNAUTHORIZED } from "../utils";
import { appointmentService } from "./appointment.service";

class SessionService {

    private readonly populatedArray = ['doctorData', 'participationsData'];

    constructor(private readonly sessionDataSource = sessionRepository) {}

    async findSession(query: Partial<ISessionModel>) {
        return await this.sessionDataSource.findOne(query);
    }

    async findSessionById(sessionId: string) {
        return await this.findSession({ _id: sessionId });
    }

    private convertTimeToMilliSeconds(timeHouresAndMuintes: string): number {
        const [hourse, minutes] = timeHouresAndMuintes.split(':');
        const newMinutes = Number(+minutes) + (Number(+hourse) * 60);
        return newMinutes * 60000;
    }

    async createPrivateSession(data: ICreatePrivateSessionQuery) {
        try {
            const { startAtIndex, appointmentId } = data;
            const { doctorId, duration, price, schedule, day } = await appointmentService.isAppointmentExist(data.appointmentId);
            
            if (startAtIndex >= schedule.length) {
                throw new ApiError('الموعد غير متاح', CONFLICT)
            }
            const selectedAppointment = schedule[startAtIndex];
            if (selectedAppointment.isBooked) {
                throw new ApiError('الموعد غير متاح', CONFLICT)
            }

            const startAt = new Date(day).getTime() + this.convertTimeToMilliSeconds(selectedAppointment.startAt);

            const newSessionData: Partial<ISessionModel> = {
                doctorId,
                duration,
                price,
                appointmentId,
                participations: data.participations,
                meetLink: data.meetLink,
                startAt: new Date(startAt),
                seats: 1,
                bookedSeats: 1,
                type: SessionTypes.PRIVATE,
                status: SessionStatus.CONFIRMED
            }
            const newSession = await this.sessionDataSource.createOne(newSessionData, this.populatedArray);
            // const isSessionOverlapped = await this.isOverlappedWithSession(newSessionData);
           
            // update appointment schedule
            schedule[startAtIndex].isBooked = true;
            schedule[startAtIndex].sessionId = newSession._id;
            await appointmentService.updateAppointmentSchedule({ appointmentId, schedule });
            
            return newSession;
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشلت عملية حجز الجلسة', INTERNAL_SERVER_ERROR)
        }
    }

    async confirmSessionByDoctor({ sessionId, doctorId, status }: { sessionId: string, doctorId: string, status: SessionStatus }) {
       try {
            const isSessionExist = await this.isSessionExist(sessionId);
            if (isSessionExist.doctorId.toString() !== doctorId.toString()) {
                throw new ApiError('ليس لديك الحق في اجراء هذا', UNAUTHORIZED);
            }
            if (isSessionExist.status !== SessionStatus.PENDING) {
                throw new ApiError('لا يمكنك تأكيد او رفض الجلسة', CONFLICT)
            }
            return await this.sessionDataSource.updateOne({ _id: sessionId, doctorId }, { status }); 
       } catch(error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية تأكيد أو رفض الجلسة', INTERNAL_SERVER_ERROR)
       }
    }

    async completedSessionByDoctor({ sessionId, doctorId }: { sessionId: string, doctorId: string }) {
       try {
            const { doctorId: sessionDoctorId, status, startAt, duration, type, appointmentId } = await this.isSessionExist(sessionId);
            if (sessionDoctorId.toString() !== doctorId.toString()) {
                throw new ApiError('ليس لديك الحق في اجراء هذا', UNAUTHORIZED);
            }
            if (status !== SessionStatus.CONFIRMED) {
                throw new ApiError('لا يمكنك تأكيد اجراء الجلسة الأن', CONFLICT)
            }
            if (new Date(startAt.getTime() + duration * 60000) > new Date()) {
                throw new ApiError('الجلسة لم تنتهي بعد!', CONFLICT)
            }

            if(type === SessionTypes.PRIVATE) {
                let  { schedule } = await appointmentService.isAppointmentExist(appointmentId) as IAppointmentModel;
                schedule = schedule.map(appointment => {
                    if(appointment.sessionId && appointment.isBooked && appointment?.sessionId.toString() === sessionId.toString()) {
                        appointment.isBooked = false;
                        appointment.sessionId = '';
                    }
                    return appointment;
                })
              
                await appointmentService.updateAppointmentSchedule({ appointmentId, schedule });
            }
            return await this.sessionDataSource.updateOne({ _id: sessionId, doctorId }, { status: SessionStatus.COMPLETED }); 
       } catch(error) {
            if(error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية تأكيد إجراء الجلسة', INTERNAL_SERVER_ERROR)
       }
    }

    async createCommuintySession(data: ICreateCommunitySessionQuery) {
        try {
            const isSessionOverlapped = await this.isOverlappedWithSession(data);
            const newCommunitSessionData = {
                ... data,
                status: SessionStatus.CONFIRMED,
                type: SessionTypes.COMMUNITY,
                price: 0,
            }
            return await this.sessionDataSource.createOne(newCommunitSessionData, this.populatedArray); 
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشا عملية إنشاء جلسة جماعية', INTERNAL_SERVER_ERROR)
        }
    }

    private async isOverlappedWithSession(data: any) {
        const { participations, startAt, duration, doctorId, sessionId } = data;
    
        const startSession = new Date(startAt);
        const endSession = new Date(startSession.getTime() + duration * 60000);
        const durationWindowStart = new Date(startSession.getTime() - duration * 60000);
    
        const isOverlapping = (existingStart: Date, existingDuration: number) => {
            const existingEnd = new Date(existingStart.getTime() + existingDuration * 60000);
            return !(existingEnd <= startSession || existingStart >= endSession);
        };
    
        // === Check Doctor's Sessions ===
        const doctorSessions = await this.findMany({
            doctorId,
            status: { $in: [SessionStatus.PENDING, SessionStatus.CONFIRMED] },
            startAt: { $gt: durationWindowStart },
        });
    
        const doctorHasOverlap = doctorSessions.some(({ startAt: s }) =>
            isOverlapping(new Date(s), duration)
        );
    
        if (doctorHasOverlap) {
            throw new ApiError('لا يمكن إنشاء هذه الجلسة .. يوجد تعارض مع موعد آخر لهذا الدكتور', CONFLICT);
        }
    
        // === Check User's Sessions ===
        const userSessions = await this.findMany({
            participations: { $in: participations },
            status: { $in: [SessionStatus.PENDING, SessionStatus.CONFIRMED] },
            startAt: { $gt: durationWindowStart },
        });
    
        const userHasOverlap = userSessions.some(({ startAt: s }) =>
            isOverlapping(new Date(s), duration)
        );
    
        if (userHasOverlap) {
            throw new ApiError('لا يمكن إنشاء هذه الجلسة .. يوجد تعارض مع موعد آخر لك', CONFLICT);
        }
    
        return false;
    }
    
    async isSessionExist(sessionId: string) {
        const isSessionExist = await this.findSessionById(sessionId);
        if (!isSessionExist) {
            throw new ApiError('الجلسة غير موجودة', NOT_FOUND);
        }
        return isSessionExist;
    }

    async userParticipateInCommunitySession({ userId, sessionId }: { sessionId: string, userId: string }) {
        try {
            const { status, bookedSeats, seats, startAt, participations } = await this.isSessionExist(sessionId);
            
            if (status !== SessionStatus.CONFIRMED) {
                throw new ApiError('لا يمكنك الإشتراك في هذه الجلسة الجماعية', CONFLICT)
            } 
            if (bookedSeats + 1 > seats) {
                throw new ApiError('لا يوجد مقاعد متاحة في هذه الجلسة', CONFLICT)
            }
            if (startAt <= new Date()) {
                throw new ApiError('انتهت فترة التسجيل في الجلسة', CONFLICT)
            }
            if (participations.includes(userId)) {
                throw new ApiError('أنت مشترك بالفعل في هذه الجلسة', CONFLICT)
            }
            const newParticipations = [ ...participations, userId ];
            return await this.sessionDataSource.updateOne({ _id: sessionId }, { participations: newParticipations, bookedSeats: bookedSeats + 1 }, this.populatedArray);
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية الإشتراك في الجلسة الجماعية', INTERNAL_SERVER_ERROR)
        }
    }

    async findMany(query: any) {
        return await this.sessionDataSource.findWithPopulate(query, this.populatedArray)
    }

    async getAllSessions(query: any) {
        try {
            const { doctorId, userId, type, status, pageNumber: page, pageSize: size } = query;
            let newQuery: any = {}
            if (doctorId) newQuery.doctorId = doctorId;
            if (userId) newQuery.participations = { $in: userId };
            if (type) newQuery.type = type;
            if (status) newQuery.status = status;
            const { limit, skip } = pagenation({ page, size });
            // console.log(newQuery);
            return await this.sessionDataSource.findWithPopulate(newQuery, this.populatedArray, { skip, limit })
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError("فشل عملية إسترجاع الجلسات", INTERNAL_SERVER_ERROR)
        }
    }
}
export const sessionService = new SessionService()