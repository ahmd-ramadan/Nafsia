import { Message } from "../models";
import { IMessageModel } from "../interfaces";
import GeneralRepository from "./general.repository";

export const messageRepository = new GeneralRepository<IMessageModel>(Message)