import { IAppointmentModel, ICreateAppointmentQuery } from "../interfaces";
import { Appointment } from "../models";
import { appointmentRepository } from "../repositories";
import { ApiError, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../utils";

class AppointmentService {
    private readonly populateArray: string[] = [ 'doctorData' ]

    constructor(
        private readonly appointmentdataSource = appointmentRepository,
    ) {}

    async findOne(query: Partial<IAppointmentModel>) {
        return await this.appointmentdataSource.findOneWithPopulate(query, this.populateArray)
    }

    async isAppointmentExist(appointmentId: string) {
        const isAppointmentExist = await this.findOne({ _id: appointmentId });
        if (!isAppointmentExist) {
            throw new ApiError('هذا الموعد غير موجود', NOT_FOUND);
        }
        return isAppointmentExist;
    }

    private async checkIsOverlapped(data: ICreateAppointmentQuery & { _id?: string }) {
        const { _id: appointmentId, day, doctorId, startAtHour, duration } = data;
        //! check doctor have appointment in this time | has any overlaps appointments
        // convert to intervals and check if any overlaps or no

        const allDoctorAppointmentsInDay = await this.findMany({ day, doctorId });
        
        const startAppointmentTime = this.convertTimeToMinutes(startAtHour);
        const endAppointmentTime = startAppointmentTime + duration;

        const isOverlapedAppointment = allDoctorAppointmentsInDay.some(
            appointment => {
                const currStartAppointmentTime = this.convertTimeToMinutes(appointment.startAtHour) 
                const currEndAppointmentTime = currStartAppointmentTime + appointment.duration;

                console.log(appointmentId, appointment._id.toString())
                if (appointmentId?.toString() === appointment._id.toString() || endAppointmentTime < currStartAppointmentTime || startAppointmentTime > currEndAppointmentTime) return false;
                else return true;
            }
        )

        if (isOverlapedAppointment) {
            throw new ApiError('لا يمكن إنشاء هذه الموعد بالنسبة لك .. يوجد تعارض مع موعد اخر', CONFLICT);
        }

        return false;
    }

    async createNewAppointment(data: ICreateAppointmentQuery) {
        try {
            await this.checkIsOverlapped(data);
            return await this.appointmentdataSource.createOne(data, this.populateArray);
            
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إضأفة موعد جديد', INTERNAL_SERVER_ERROR);
        }
    }

    async updateAppointment({ appointmentId, data }: { appointmentId: string, data: Partial<ICreateAppointmentQuery> }) {
        try {
            const { duration, startAtHour, doctorId } = data;

            let isAppointmentExist = await this.isAppointmentExist(appointmentId);

            if (isAppointmentExist.doctorId.toString() !== doctorId) {
                throw new ApiError('ليس لديك الحق في غجراء أي تعديل هنا', UNAUTHORIZED)
            }

            if(duration) isAppointmentExist.duration = duration;
            if(startAtHour) isAppointmentExist.startAtHour = startAtHour;

            await this.checkIsOverlapped(isAppointmentExist);
            
            return await this.appointmentdataSource.updateOne({ _id: appointmentId }, data, this.populateArray);
            
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
                throw new ApiError('ليس لديك الحق في غجراء أي تعديل هنا', UNAUTHORIZED)
            }

            return await this.appointmentdataSource.deleteOne({ _id: appointmentId });
            
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية إضأفة موعد جديد', INTERNAL_SERVER_ERROR);
        }
    }

    async getAllAppointmentsForDoctor(doctorId: string) {
        return await this.findMany({ doctorId });
    }

    private convertTimeToMinutes(timeHouresAndMuintes: string): number {
        const [hourse, minutes] = timeHouresAndMuintes.split(':');
        const newMinutes = Number(+minutes) + (Number(+hourse) * 60);
        return newMinutes;
    }

    async findMany(query: Partial<IAppointmentModel>) {
        return await this.appointmentdataSource.findWithPopulate(query, this.populateArray)
    }
    
}

export const appointmentService = new AppointmentService();