import mongoose, { Schema } from 'mongoose'
import { IReviewModel } from '../interfaces';

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        idex: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
    comment: { 
        type: String 
    },
},
{ 
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.virtual('doctorData', {
    localField: 'doctorId',
    foreignField: '_id',
    ref: 'User',
    justOne: true
})
reviewSchema.virtual('userData', {
    localField: 'userId',
    foreignField: '_id',
    ref: 'User',
    justOne: true
})

export const Review = mongoose.model<IReviewModel>("Review", reviewSchema);