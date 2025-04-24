import { ICloudinaryIMage, ICreatePostQuery, IPost, IPostModel, IUpdatePostQuery } from "../interfaces";
import { postRepository } from "../repositories";
import { ApiError, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../utils";
import { reactService } from "./react.service";
import { cloudinaryService } from "./cloudinary.service";
import { cloudinaryPostFolder } from "../config";
import { tagService } from "./tag.service";

class PostService {
    private readonly populateArray: string[] = [ 
        'doctorData', 'tagsData', 'reactionsData'
    ]

    constructor(
        private readonly postDataSource = postRepository,
    ) {}

    async createOne({ data, files }: { data: ICreatePostQuery, files: any }) {
        try {
            // uploads images
            const newImages: ICloudinaryIMage[] = [];
            for (const file of files) {
                const { secure_url, public_id } = await cloudinaryService.uploadImage({ fileToUpload: file.path, folderPath: cloudinaryPostFolder })
                newImages.push({ secure_url, public_id })
            }

            const newPostData = {
                ... data,
                images: newImages
            }
            return await this.postDataSource.createOne(newPostData, this.populateArray);
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشلت عملية إضافة منشور جديد', INTERNAL_SERVER_ERROR)
        }
    }

    async findOne(query: any) {
        return await this.postDataSource.findOneWithPopulate(query, this.populateArray)
    }

    async find({ doctorId, tags }: { doctorId?: string, tags?: string[] }) {
        const query: any = {};
        
        if (doctorId) {
            query.doctorId = doctorId
        }
        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }
        return await this.postDataSource.findWithPopulate(query, this.populateArray);
    }

    async findMany({ doctorId, tags }: { doctorId?: string, tags?: string[] }) {
        const query: any = {};
        
        if (doctorId && doctorId !== undefined) {
            query.doctorId = doctorId
        }
        if (tags && tags.length > 0 && tags !== undefined) {
            query.tags = { $in: tags };
        }

        const allPosts = await this.postDataSource.find(query);
        return await this.formatPostsResponse(allPosts);
    }

    async isPostExist(postId: string) {
        const post = await this.postDataSource.findByIdWithPopulate(postId, this.populateArray);
        if (!post) {
            throw new ApiError('هذا المنشور غير موجود', NOT_FOUND);
        }
        return post;
    }

    async updateOne({ postId, doctorId, data, files }: { postId: string; doctorId: string; data: Partial<IUpdatePostQuery>; files?: any }) {
        try {
            const { oldPublicIds, content, tags, title } = data;
            const { images, doctorId: postDoctorId } = await this.isPostExist(postId);

            if (postDoctorId.toString() !== doctorId.toString()) {
                throw new ApiError('ليس لديك الحق في التعديل', UNAUTHORIZED)
            }

            const updatedPostData: Partial<IPostModel> = {}
            if (oldPublicIds) {
                if (!files || oldPublicIds.length !== files?.length) {
                    throw new ApiError('يجب ان يكون عدد الصور الجديدة = عدد ال ids', CONFLICT)
                }
                let newImages: ICloudinaryIMage[] = images;
                for (let i = 0; i < oldPublicIds.length; i ++) {
                    const oldPublicId = oldPublicIds[i];
                    const newFile = files[i];

                    const { secure_url } = await cloudinaryService.updateImage({ 
                        fileToUpload: newFile.path,
                        folderPath: cloudinaryPostFolder,
                        oldPublicId
                    })
                    newImages = newImages.map(image => {
                        return image.public_id === oldPublicId ? {
                            secure_url,
                            public_id: oldPublicId
                        } : image;
                    })
                }
                updatedPostData.images = newImages;
            }

            if (title) updatedPostData.title = title;
            if (tags && tags?.length > 0) updatedPostData.tags = tags;
            if (content) updatedPostData.content = content;

            return this.postDataSource.updateOne({ _id: postId }, updatedPostData, this.populateArray);
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية تحديث المنشور', INTERNAL_SERVER_ERROR)
        }  
    }

    async deletePostById({ postId, doctorId }: { postId: string; doctorId: string }) {
        try {
            const { doctorId: postDoctorId, images } = await this.isPostExist(postId);
            if (postDoctorId.toString() !== doctorId.toString()) {
                throw new ApiError('ليس لديك حق في إجراء هذا', UNAUTHORIZED);
            }
           
            await reactService.deleteMany({ postId });
            const deletedPost = await this.postDataSource.deleteOne({ _id: postId });
            
            // delete images from cloudinary 
            for(const image of images) {
                await cloudinaryService.deleteImage(image.public_id);
            }

            // delete reacts on post
            await reactService.deleteAllReactsOnPost(postId)
           
            return deletedPost;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشل عملية حذف المنشور', INTERNAL_SERVER_ERROR)
        }
    }

    async formatPostsResponse(posts: IPostModel[]) {
        // Reactions Data with User Data & Doctor Data & Tags Data 
        const postsResponse = [];
        for (const { _id: postId,  } of posts) {
            const postReactions = await reactService.getAllReactsOnPost(postId);
            const { _id, title, content, createdAt, updatedAt, tagsData, doctorData, doctorId, images,  } = await this.findOne({ _id: postId }) as IPost;

            const postResponseObject: any = {
                _id,
                title,
                images,
                content,
                doctorData,
                tagsData,
                reactionsData: postReactions,
                createdAt,
                updatedAt
            }
            postsResponse.push(postResponseObject)
        }
        return postsResponse;
    }
    
}

export const postService = new PostService();