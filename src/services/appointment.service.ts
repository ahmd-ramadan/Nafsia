import { IAppointmentModel, IAppointmentSchedule, ICreateAppointmentQuery } from "../interfaces";
import { appointmentRepository } from "../repositories";
import { ApiError, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, pagenation, UNAUTHORIZED } from "../utils";
import { FilterQuery } from "mongoose";

class AppointmentService {
    private readonly populateArray: string[] = [ 'doctorData' ]

    constructor(
        private readonly appointmentDataSource = appointmentRepository,
    ) {}

    async findOne(query: Partial<IAppointmentModel>) {
        return await this.appointmentDataSource.findOneWithPopulate(query, this.populateArray)
    }

    async isAppointmentExist(appointmentId: string) {
        const isAppointmentExist = await this.findOne({ _id: appointmentId });
        if (!isAppointmentExist) {
            throw new ApiError('هذا الموعد غير موجود', NOT_FOUND);
        }
        return isAppointmentExist;
    }

    // private async checkIsOverlapped(data: ICreateAppointmentQuery & { _id?: string }) {
    //     const { _id: appointmentId, day, doctorId, startAtHour, duration } = data;
    //     //! check doctor have appointment in this time | has any overlaps appointments
    //     // convert to intervals and check if any overlaps or no

    //     const allDoctorAppointmentsInDay = await this.findMany({ day, doctorId });
        
    //     const startAppointmentTime = this.convertTimeToMinutes(startAtHour);
    //     const endAppointmentTime = startAppointmentTime + duration;

    //     const isOverlapedAppointment = allDoctorAppointmentsInDay.some(
    //         appointment => {
    //             const currStartAppointmentTime = this.convertTimeToMinutes(appointment.startAtHour) 
    //             const currEndAppointmentTime = currStartAppointmentTime + appointment.duration;

    //             console.log(appointmentId, appointment._id.toString())
    //             if (appointmentId?.toString() === appointment._id.toString() || endAppointmentTime < currStartAppointmentTime || startAppointmentTime > currEndAppointmentTime) return false;
    //             else return true;
    //         }
    //     )

    //     if (isOverlapedAppointment) {
    //         throw new ApiError('لا يمكن إنشاء هذه الموعد بالنسبة لك .. يوجد تعارض مع موعد اخر', CONFLICT);
    //     }

    //     return false;
    // }

    async checkIsOverlappedForSchedule({ schedule, duration }: { schedule: IAppointmentSchedule[], duration: number }) {
        // order by startAt
        const sortedSchedule = schedule.sort((a, b) => this.convertTimeToMinutes(a.startAt) - this.convertTimeToMinutes(b.startAt));
        // console.log("Sorted Schedule", sortedSchedule)
        const isOverlapedAppointment = sortedSchedule.some(
            (appointment, index) => {
                const currStartAppointmentTime = this.convertTimeToMinutes(appointment.startAt)
                const currEndAppointmentTime = currStartAppointmentTime + duration;

                if (index + 1 < sortedSchedule.length && currEndAppointmentTime > this.convertTimeToMinutes(sortedSchedule[index + 1].startAt)) {
                    return true;
                }
                return false;
            }
        )

        if (isOverlapedAppointment) {
            throw new ApiError('جدول المواعيد غير صالح .. المدة بين الموعد والذي يليه علي الاقل تساوي المدة المحددة', CONFLICT);
        }
        
    }

    async createNewAppointment(data: ICreateAppointmentQuery) {
        try {
            
            // await this.checkIsOverlapped(data);
            const { schedule, duration } = data;
            await this.checkIsOverlappedForSchedule({ schedule, duration });
            return await this.appointmentDataSource.createOne(data, this.populateArray);
            
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إضافة موعد جديد', INTERNAL_SERVER_ERROR);
        }
    }
    
    async updateAppointmentSchedule({ appointmentId, schedule }: { appointmentId: string, schedule: IAppointmentSchedule[] }) {
        try {
            const isAppointmentExist = await this.isAppointmentExist(appointmentId);
            return await this.appointmentDataSource.updateOne({ _id: appointmentId }, { schedule }, this.populateArray);
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إضافة موعد جديد', INTERNAL_SERVER_ERROR);
        }
    }   

    async updateAppointment({ appointmentId, data }: { appointmentId: string, data: Partial<ICreateAppointmentQuery> }) {
        try {
            const { duration, doctorId, schedule, price, day } = data;

            let isAppointmentExist = await this.isAppointmentExist(appointmentId);

            if (isAppointmentExist.doctorId.toString() !== doctorId) {
                throw new ApiError('ليس لديك الحق في إجراء أي تعديل هنا', UNAUTHORIZED)
            }

            if(day) isAppointmentExist.day = day;
            if(price) isAppointmentExist.price = price;
            if(duration) isAppointmentExist.duration = duration;
            if(schedule) isAppointmentExist.schedule = schedule;

            // await this.checkIsOverlapped(isAppointmentExist);
            await this.checkIsOverlappedForSchedule({ schedule: isAppointmentExist.schedule, duration: isAppointmentExist.duration });

            return await this.appointmentDataSource.updateOne({ _id: appointmentId }, isAppointmentExist, this.populateArray);
            
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إضأفة موعد جديد', INTERNAL_SERVER_ERROR);
        }
    }

    async deleteAppointment({ appointmentId, doctorId }: { appointmentId: string, doctorId: string }) {
        try {
            let isAppointmentExist = await this.isAppointmentExist(appointmentId);

            if (isAppointmentExist.doctorId.toString() !== doctorId) {
                throw new ApiError('ليس لديك الحق في إجراء أي تعديل هنا', UNAUTHORIZED)
            }

            return await this.appointmentDataSource.deleteOne({ _id: appointmentId });
            
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إضأفة موعد جديد', INTERNAL_SERVER_ERROR);
        }
    }

    private convertTimeToMinutes(timeHouresAndMuintes: string): number {
        const [hourse, minutes] = timeHouresAndMuintes.split(':');
        const newMinutes = Number(+minutes) + (Number(+hourse) * 60);
        return newMinutes;
    }

    async findMany({ pageNumber, pageSize, doctorId, day, duration, price }: { pageNumber: number, pageSize: number, doctorId?: string, day?: Date, duration?: number, price?: number }) {
        let query: FilterQuery<IAppointmentModel> = {};
        if (doctorId) query.doctorId = doctorId;
        if (day) query.day = { $gte: day };
        if (duration) query.duration = { $gte: duration };
        if (price) query.price = { $gte: price };
        const { skip, limit } = pagenation({ page: pageNumber, size: pageSize });
        return await this.appointmentDataSource.findWithPopulate(query, this.populateArray, { skip, limit })
    }   
}

export const appointmentService = new AppointmentService();