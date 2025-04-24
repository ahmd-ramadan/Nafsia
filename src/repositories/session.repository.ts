import { Session } from "../models";
import { ISessionModel, ISession } from "../interfaces";
import GeneralRepository from "./general.repository";

export const sessionRepository = new GeneralRepository<ISessionModel, ISession>(Session)