import { UserGender } from "../enums"
import { IDBModel } from "./database.interface"

export interface IMeasurementModel extends IDBModel {
    userId: string,
    gender: string,
    age: number,
    occupation: string,
    sleep_duration: number,
    sleep_quality: number,
    bmi_category: string,
    heart_rate: number,
    daily_steps: number,
    systolic_bp: number,
    diastolic_bp: number,
    stress_level: number
}

export interface IMeasurement extends IMeasurementModel {}

export interface ICreateMeasurementQuery {
    gender: string,
    age: number,
    occupation: string,
    sleep_duration: number,
    sleep_quality: number,
    bmi_category: string,
    heart_rate: number,
    daily_steps: number,
    systolic_bp: number,
    diastolic_bp: number,
    stress_level: number
}

export interface ICreateMeasurementData extends ICreateMeasurementQuery {
    userId: string
}