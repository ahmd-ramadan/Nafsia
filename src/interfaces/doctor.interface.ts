import { IDBModel } from "./database.interface";
import { IUserModel } from "./user.interface";

export interface IDoctorModel extends IDBModel {
    userId: string,
    isApproved: boolean,
    specialization: string,
    rate: number,
    balance: number
} 

export interface IDoctor extends IDoctorModel {
    userData: IUserModel,
    isApproved: boolean,
    specialization: string,
    rate: number,
    balance: number
} 

export interface ICreateDoctorQuery {
    userId: string,
    specialization: string
}