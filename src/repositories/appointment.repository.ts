import { Appointment } from "../models"
import { IAppointmentModel, IAppointment } from "../interfaces";
import GeneralRepository from "./general.repository";

export const appointmentRepository = new GeneralRepository<IAppointmentModel, IAppointment>(Appointment)