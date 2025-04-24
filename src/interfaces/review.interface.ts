import { IDBModel } from "./database.interface";
import { IUser } from "./user.interface";

export interface IReviewModel extends IDBModel {
    userId: string;
    doctorId: string;
    comment: string;
    rating: number;
}

export interface IReview extends IReviewModel {
    userData: IUser;
    doctorData: IUser;
}

export interface ICreateReviewQuery {
    userId: string;
    doctorId: string;
    comment?: string;
    rating: number;
}