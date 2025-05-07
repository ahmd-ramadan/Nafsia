import { ICloudinaryIMage } from "./cloudinary.interface";
import { IDBModel } from "./database.interface";
import { IUserModel } from "./user.interface";

export interface IDoctorModel extends IDBModel {
    userId: string,
    isApproved: boolean,
    specialization: string,
    rate: number,
    balance: number,
    medicalLicense: ICloudinaryIMage,
    description: string,
} 

export interface IDoctor extends IDoctorModel {}

export interface ICreateDoctorQuery {
    userId: string,
    specialization: string,
    medicalLicense: ICloudinaryIMage,
    description?: string,
}