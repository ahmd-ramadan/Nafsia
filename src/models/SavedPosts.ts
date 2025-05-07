import mongoose, { Schema } from 'mongoose'
import { ISavedPostsModel } from '../interfaces';

const savedPostsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        }
    ]
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

savedPostsSchema.virtual('userData', {
    localField: 'userId',
    foreignField: '_id',
    ref: 'User'
})

savedPostsSchema.virtual('postsData', {
    localField: 'posts',
    foreignField: '_id',
    ref: 'Post',
    justOne: false,
    options: {
        populate: {
            path: 'doctorData',
            select: 'name avatar _id'
        }
    }
})

export const SavedPosts = mongoose.model<ISavedPostsModel>('SavedPosts', savedPostsSchema);