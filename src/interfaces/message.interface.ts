import { IDBModel } from "./database.interface";

export interface IMessageModel extends IDBModel {
    message: string,
    sessionId: string
}

export interface IMessage extends IMessageModel {}

export interface ICreateMessageQuery {
    message: string,
    sessionId: string;
}