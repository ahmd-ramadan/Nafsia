import { IDBModel } from "./database.interface";
import { IUser } from "./user.interface";

export interface IAppointmentModel extends IDBModel {
    doctorId: string;
    day: Date;
    duration: number;
    price: number;
    schedule: IAppointmentSchedule[]
}

export interface IAppointmentSchedule {
    startAt: string;
    isBooked?: boolean;
    sessionId?: string;
}

export interface IAppointment extends IAppointmentModel {
    doctorData: IUser
}

export interface ICreateAppointmentQuery {
    doctorId: string;
    day: Date;
    duration: number;
    price: number;
    schedule: Pick<IAppointmentSchedule, 'startAt'>[]
}