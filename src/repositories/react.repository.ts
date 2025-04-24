import { React } from "../models";
import { IReactModel, IReact } from "../interfaces";
import GeneralRepository from "./general.repository";

export const reactRepository = new GeneralRepository<IReactModel, IReact>(React)