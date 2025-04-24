import { ReactTypesEnum } from "../enums/react.enums";
import { IDBModel } from "./database.interface";
import { IUser } from "./user.interface";

export interface IReactModel extends IDBModel {
    userId: string,
    postId: string,
    reactType: ReactTypesEnum
}

export interface IReact extends IReactModel {
    userData: IUser
}

export interface ICreateReactQuery {
    userId: string,
    postId: string,
    reactType: ReactTypesEnum
}