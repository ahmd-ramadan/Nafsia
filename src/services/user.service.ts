import { cloudinaryAvatarsFolder } from "../config";
import { ICreateUserQuery, IUserModel } from "../interfaces";
import { userRepository } from "../repositories";
import { ApiError, CONFLICT, NOT_FOUND, pagenation } from "../utils";
import { cloudinaryService } from "./cloudinary.service";
import { doctorService } from "./doctor.service";
import { HashingService } from "./hashing.service";

class UserService {

    private readonly populateUserArray = ['doctorData'];
    constructor(private readonly userDataSource = userRepository) {}

    async isUserExist(userId: string) {
        const isUserExist = await this.userDataSource.findByIdWithPopulate(userId, this.populateUserArray);
        if (!isUserExist) {
            throw new ApiError('هذا المستخدم غير موجود', NOT_FOUND)
        }
        return isUserExist;
    }
    async findUserByEmail(email: string) {
        return await this.userDataSource.findOneWithPopulate({ email }, this.populateUserArray);
    }

    async createNewUser(data: ICreateUserQuery) {
        return await this.userDataSource.createOne(data, this.populateUserArray)
    }

    async updateOne({ userId, data }: { userId: string, data: Partial<IUserModel> }) {
        return await this.userDataSource.updateOne({ _id: userId }, data, this.populateUserArray)
    }

    async updateProfile({ userId, data, files }: { userId: string, data: Partial<IUserModel> & { specialization?: string }, files: any }) {
        const { name, age, phone, specialization } = data;

        const { avatar } = await this.isUserExist(userId);

        const updatedData: Partial<IUserModel> = {}
        if (name) updatedData.name = name;
        if (age) updatedData.age = age;
        if (phone) updatedData.phone = phone;

        if (specialization) {
            await doctorService.updateOne({ userId, data: { specialization } });
        }

        if (files && files.length) {
            const { secure_url, public_id } = await cloudinaryService.uploadImage({ 
                fileToUpload: files[0].path,
                folderPath: cloudinaryAvatarsFolder 
            });
            if (avatar?.secure_url && avatar?.public_id) {
                await cloudinaryService.deleteImage(avatar?.public_id);
            }
            updatedData.avatar = {
                secure_url,
                public_id
            }
        }

        return await this.updateOne({ userId, data: updatedData })
    }

    async updatePassword({ userId, oldPassword, newPassword }: { userId: string, oldPassword: string, newPassword: string }) {
        const { password } = await this.isUserExist(userId);

        const isMatched = await HashingService.compare(oldPassword, password as string);
        if (!isMatched) {
            throw new ApiError('كلمة المرور القديمة غير صحيحة', CONFLICT)
        }

        const hashedPassword = await HashingService.hash(newPassword);

        return await this.updateOne({ userId, data: { password: hashedPassword } })
    } 
    
    async findUserById(userId: string) {
        return await this.userDataSource.findByIdWithPopulate(userId, this.populateUserArray)
    }
    
    async findDoctorUser(userId: string) {
        return await this.userDataSource.findByIdWithPopulate(userId, this.populateUserArray) 
    }

    async findAllUsers({ pageNumber, pageSize, role }: { pageNumber: number, pageSize: number, role?: string }) {
        const { limit, skip } = pagenation({ page: pageNumber, size: pageSize });
        let query: any = {}
        if (role) query.role = role;
        return this.userDataSource.findWithPopulate(query, this.populateUserArray, { skip, limit })
    }

    async searchDoctorsByName({ q, pageNumber, pageSize }: { q: string, pageNumber: number, pageSize: number }) {
        const query = {
            role: 'doctor',
            name: { $regex: q, $options: 'i' }
        }; 
        const { limit, skip } = pagenation({ page: pageNumber, size: pageSize });
        return await this.userDataSource.findWithPopulate(query, this.populateUserArray, { skip, limit });
    }
}

export const userService = new UserService();