import mongoose, { Schema } from 'mongoose'
import { IMessageModel } from '../interfaces/message.interface';

const messageSchema = new Schema({
    sessionId: {
        type: Schema.Types.ObjectId, 
        ref: 'Session',
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

export const Message = mongoose.model<IMessageModel>('Message', messageSchema);
