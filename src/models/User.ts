import mongoose, { Schema } from 'mongoose'
import { UserGender, UserRolesEnum } from '../enums'
import { IUserModel } from '../interfaces';

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        index: true
    }, 
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: Object.values(UserRolesEnum),
        default: UserRolesEnum.USER
    },
    avatar: {
        secure_url: String,
        public_id: String
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: Object.values(UserGender)
    },
    isVerified: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

userSchema.pre('save', function (next) {
    if (this.role === UserRolesEnum.DOCTOR) {
        if (!this.avatar) next(new Error('Profile image is required for doctors.'));
        if (!this.age) return next(new Error('Age is required for doctors.'));
        if (!this.gender) return next(new Error('Gender is required for doctors.'));
    }
    next();
});

userSchema.virtual('doctorData', {
    ref: 'Doctor',     
    localField: '_id',  
    foreignField: 'userId',  
    justOne: true, 
    options: {
        select: 'specialization rate balance isApproved medicalLicense'
    }
});


export const User = mongoose.model<IUserModel>('User', userSchema);