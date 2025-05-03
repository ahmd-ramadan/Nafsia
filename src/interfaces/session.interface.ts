import { SessionStatus, SessionTypes } from "../enums";
import { IDBModel } from "./database.interface";
import { IUser } from "./user.interface";

export interface ISessionModel extends IDBModel {
    doctorId: string;
    participations: string[];
    seats: number;
    bookedSeats: number;
    meetLink: string;
    duration: number;
    startAt: Date;
    price: number;
    type: SessionTypes;
    status: SessionStatus;
} 

export interface ISession extends ISessionModel {
    doctorData: IUser;
    participationsData: IUser[];
} 

export interface ICreatePrivateSessionQuery {
    appointmentId: string;
    participations: string[];
    meetLink: string;
    startAt: Date;
} 

export interface ICreateCommunitySessionQuery {
    doctorId: string;
    participations: string[];
    meetLink: string;
    startAt: Date;
    duration: number;
    seats: number;
} 