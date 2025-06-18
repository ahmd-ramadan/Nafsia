import mongoose, { Schema } from 'mongoose'
import { IOtpModel } from '../interfaces';
import { IMeasurementModel } from '../interfaces';

const measurementSchema = new Schema({
    userId: { 
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    sleep_duration: {
        type: Number,
        required: true
    },
    sleep_quality: {
        type: Number,
        required: true
    },
    bmi_category: {
        type: String,
        required: true
    },
    heart_rate: {
        type: Number,
        required: true
    },
    daily_steps: {
        type: Number,
        required: true
    },
    systolic_bp: {
        type: Number,
        required: true
    },
    diastolic_bp: {
        type: Number,
        required: true
    },
    stress_level: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Measurement = mongoose.model<IMeasurementModel>('Measurement', measurementSchema);
