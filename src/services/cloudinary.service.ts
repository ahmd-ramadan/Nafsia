import { v2 as cloudinary } from 'cloudinary';
import { unlinkSync } from 'fs';
import {
    cloudinaryApiKey,
    cloudinaryApiSecret,
    cloudinaryCloudName,
} from '../config';
import { ApiError, BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../utils';
import { ICloudinaryIMage } from '../interfaces';

export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: cloudinaryCloudName,
            api_key: cloudinaryApiKey,
            api_secret: cloudinaryApiSecret,
        });
    }

    async uploadImage({ fileToUpload, folderPath }: { fileToUpload: string, folderPath: string }): Promise<ICloudinaryIMage> {
        try {
            const { secure_url, public_id } = await cloudinary.uploader.upload(fileToUpload, {
                folder: folderPath,
            });

            if (!secure_url || !public_id) {
                throw new ApiError('فشل في تحميل الصورة', BAD_REQUEST);
            }

            return { secure_url, public_id };
        } catch (err) {
            console.error(err);
            throw new ApiError('شئ ما خطأ أثناء تحميل الصور', INTERNAL_SERVER_ERROR);
        } finally {
            unlinkSync(fileToUpload);
        }
    }

    async deleteImage(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result !== 'ok' && result.result !== 'not found') {
                throw new ApiError('فشل في حذف الصورة', BAD_REQUEST);
            }
            return true;
        } catch (err) {
            console.error(err);
            throw new ApiError('شئ ما خطأ أثناء حذف الصور', INTERNAL_SERVER_ERROR);
        }
    }

    async updateImage({
        oldPublicId,
        fileToUpload,
        folderPath,
    }: {
        oldPublicId: string;
        fileToUpload: string;
        folderPath: string;
    }): Promise<ICloudinaryIMage> {
        try {
            // Delete the old image
            await this.deleteImage(oldPublicId);

            // Upload the new image
            return await this.uploadImage({ fileToUpload, folderPath });
        } catch (err) {
            console.error(err);
            throw new ApiError('شئ ما خطأ أثناء تحديث الصورة', INTERNAL_SERVER_ERROR);
        }
    }
}

export const cloudinaryService = new CloudinaryService();
