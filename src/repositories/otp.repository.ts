import { Otp } from "../models";
import { IOtpModel } from "../interfaces";
import GeneralRepository from "./general.repository";

export const otpRepository = new GeneralRepository<IOtpModel>(Otp)