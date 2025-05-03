import { UserGender, UserRolesEnum } from "../enums";
import { ICloudinaryIMage } from "./cloudinary.interface";
import { IDBModel } from "./database.interface";
import { IDoctorModel } from "./doctor.interface";

export interface IUserModel extends IDBModel {
    name: string;
    email: string;
    phone: string;
    role: UserRolesEnum,
    age: number;
    gender: UserGender,
    avatar?: ICloudinaryIMage,
    password?: string,
    isVerified: boolean
}

export interface IUser extends IUserModel {
    doctorData: IDoctorModel
}

export interface ICreateUserQuery {
    name: string;
    email: string;
    phone: string;
    role: UserRolesEnum,
    age?: number;
    avatar?: ICloudinaryIMage,
    gender?: UserGender,
    password: string,
    specialization?: string
    medicalLicense?: ICloudinaryIMage
}