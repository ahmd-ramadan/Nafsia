import { Tag } from "../models";
import { ITagModel } from "../interfaces";
import GeneralRepository from "./general.repository";

export const tagRepository = new GeneralRepository<ITagModel>(Tag)