
import { Measurement } from "../models";
import { IMeasurement, IMeasurementModel } from "../interfaces";
import GeneralRepository from "./general.repository";

export const measurementRepository = new GeneralRepository<IMeasurementModel, IMeasurement>(Measurement)