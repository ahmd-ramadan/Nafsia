import { DayOfWeek } from "../enums";
import { IDBModel } from "./database.interface";
import { IUser } from "./user.interface";

export interface IAppointmentModel extends IDBModel {
    doctorId: string;
    day: DayOfWeek;
    startAtHour: string;
    duration: number;
    price: number;
}

export interface IAppointment extends IAppointmentModel {
    doctorData: IUser
}

export interface ICreateAppointmentQuery {
    doctorId: string;
    day: DayOfWeek;
    startAtHour: string;
    duration: number;
    price: number;
}