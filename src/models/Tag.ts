import mongoose, { Schema } from 'mongoose'
import { ITagModel } from '../interfaces';

const tagSchema = new Schema({
    name: {
        type: String, 
        unique: true,
        required: true,
        index: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

tagSchema.virtual('adminData', {
    ref: 'User',
    localField: 'adminId',
    foreignField: '_id',
    justOne: true,
    options: { 
        select: 'name email _id' 
    }
});

export const Tag = mongoose.model<ITagModel>('Tag', tagSchema);
