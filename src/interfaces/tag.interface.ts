import { IDBModel } from "./database.interface";
import { IUser } from "./user.interface";

export interface ITagModel extends IDBModel {
    name: string;
    adminId: string
}

export interface ITag extends ITagModel {
    adminData: IUser
}

export interface ICreateTagQuery {
    name: string,
    adminId: string
}