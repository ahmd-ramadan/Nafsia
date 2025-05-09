import mongoose, { Schema } from 'mongoose'
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
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    schedule: [
        {
            startAt: {
                type: String,
                RegExp: AppointmentStartTime,
                required: true
            },
            isBooked: {
                type: Boolean,
                default: false
            },
            sessionId: {
                type: Schema.Types.ObjectId,
                ref: 'Session',
                required: false
            }
        }
    ]
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
        // select: 'name avatar _id',
        populate: {
            path: 'doctorData',
        }
    }
});

export const Appointment = mongoose.model<IAppointmentModel>('Appointment', appointmentSchema);