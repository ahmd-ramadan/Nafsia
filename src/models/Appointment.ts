import mongoose, { Schema } from 'mongoose'
import { DayOfWeek } from '../enums'
import { IAppointmentModel } from '../interfaces';
import { AppointmentStartTime } from '../utils';

const appointmentSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    day: {
        type: String,
        enum: Object.values(DayOfWeek),
        required: true
    },
    startAtHour: {
        type: String,
        RegExp: AppointmentStartTime,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

appointmentSchema.virtual('doctorData', {
    ref: 'User',
    localField: 'doctorId',
    foreignField: '_id',
    justOne: true,
    options: { 
        select: 'name avatar _id' 
    }
});


export const Appointment = mongoose.model<IAppointmentModel>('Appointment', appointmentSchema);