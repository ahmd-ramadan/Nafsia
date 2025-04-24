
import { Doctor } from "../models";
import { IDoctor, IDoctorModel } from "../interfaces";
import GeneralRepository from "./general.repository";

export const doctorRepository = new GeneralRepository<IDoctorModel, IDoctor>(Doctor)