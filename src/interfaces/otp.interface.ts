import { IDBModel } from "./database.interface";

export interface IOtpModel extends IDBModel {
    userId: string,
    otp: string,
    expiresAt: Date
}

export interface IOtp extends IOtpModel {}

export interface ICreateOtpQuery {
    userId: string,
    otp: string,
    expiresAt: Date
}