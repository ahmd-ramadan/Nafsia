import mongoose, { Schema } from 'mongoose'
import { IOtpModel } from '../interfaces';

const otpSchema = new Schema({
    otp: {
        type: String, 
        unique: true,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

export const Otp = mongoose.model<IOtpModel>('Otp', otpSchema);
