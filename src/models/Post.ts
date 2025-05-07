import mongoose, { Schema } from 'mongoose'
import { IPostModel } from '../interfaces';

const postSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
            required: true
        }
    ],
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    images: [
        {
            secure_url: {
                type: String,
                required: true
            },
            public_id: { 
                type: String,
                required: true
            }
        }
    ],
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true, versionKey: false },
    toJSON: { virtuals: true, versionKey: false } 
})

postSchema.virtual('doctorData', {
    ref: 'User',
    localField: 'doctorId',
    foreignField: '_id',
    justOne: true,
    options: { 
        select: 'name avatar _id createdAt doctorData' 
    }
});

postSchema.virtual('tagsData', {
    ref: 'Tag',
    localField: 'tags',
    foreignField: '_id',
    justOne: false,
    options: { 
        select: 'name _id' 
    }
});

postSchema.virtual('reactionsData', {
    ref: 'React',
    localField: '_id',
    foreignField: 'postId',
    justOne: false,
    options: { 
        select: 'userData' 
    }
});

export const Post = mongoose.model<IPostModel>('Post', postSchema);
