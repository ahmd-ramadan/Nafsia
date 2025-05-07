import mongoose, { Schema } from 'mongoose'
import { IDoctorModel } from '../interfaces';

const doctorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        trim: true,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    rate: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0
    },
    medicalLicense: {
        secure_url: String,
        public_id: String
    },
    description: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false }
})

doctorSchema.virtual('userData', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
    // options: { 
    //     select: 'name avatar _id' 
    // }
});

export const Doctor = mongoose.model<IDoctorModel>('Doctor', doctorSchema);