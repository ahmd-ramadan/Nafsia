import mongoose, { Schema } from 'mongoose'
import { SessionStatus, SessionTypes } from '../enums'
import { ISessionModel } from '../interfaces';
import { ApiError, BAD_REQUEST } from '../utils';

const sessionSchema = new Schema({
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: false,
        index: true
    },
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
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
            required: true,
        }
    ]
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

sessionSchema.pre('save', async function(next) {
    if(this.type === SessionTypes.PRIVATE) {
        this.title = 'Private Session'
        this.description = 'Private Session'
        this.tags = []
    } else {
        if (!this.title) {
            throw new ApiError('العنوان مطلوب', BAD_REQUEST)
        }
        this.description = this.description || 'Public Session'
        this.tags = this.tags || []
    }
    next()
})

sessionSchema.virtual('doctorData', {
    ref: 'User',
    localField: 'doctorId',
    foreignField: '_id',
    justOne: true,
    options: { 
        // select: 'name avatar email _id',
        populate: {
            path: 'doctorData',
        }
    }
});
sessionSchema.virtual('participationsData', {
    ref: 'User',
    localField: 'participations',
    foreignField: '_id',
    justOne: false,
    options: { 
        select: 'name avatar email_id',
    }
});


export const Session = mongoose.model<ISessionModel>('Session', sessionSchema);