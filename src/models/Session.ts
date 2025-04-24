import mongoose, { Schema } from 'mongoose'
import { SessionStatus, SessionTypes } from '../enums'
import { ISessionModel } from '../interfaces';

const sessionSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    participations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
    ],
    startAt: {
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
    seats: {
        type: Number,
        default: 1
    },
    bookedSeats: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: Object.values(SessionTypes),
        defauld: SessionTypes.PRIVATE,
        index: true
    },
    status: {
        type: String,
        enum: Object.values(SessionStatus),
        defauld: SessionStatus.PENDING,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

sessionSchema.virtual('doctorData', {
    ref: 'User',
    localField: 'doctorId',
    foreignField: '_id',
    justOne: true,
    options: { 
        select: 'name avatar _id' 
    }
});
sessionSchema.virtual('participationsData', {
    ref: 'User',
    localField: 'participations',
    foreignField: '_id',
    justOne: false,
    options: { 
        select: 'name avatar _id' 
    }
});


export const Session = mongoose.model<ISessionModel>('Session', sessionSchema);