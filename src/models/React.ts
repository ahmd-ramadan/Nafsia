import mongoose, { Schema } from 'mongoose'
import { IReactModel } from '../interfaces';
import { ReactTypesEnum } from '../enums/react.enums';

const reactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    reactType: {
        type: String,
        enum: Object.values(ReactTypesEnum),
        required: true
    },
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

reactSchema.virtual('userData', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
    options: { 
        select: 'name avatar _id' 
    }
});

export const React = mongoose.model<IReactModel>('React', reactSchema);
