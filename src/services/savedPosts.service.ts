import { ISavedPostsModel } from "../interfaces";
import { savedPostsRepository } from "../repositories";
import { ApiError, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../utils";
import { postService } from "./post.service";

class SavedPostsService {

    private readonly populatedArray = ['postsData'];
    constructor(private readonly savePostsDataSource = savedPostsRepository) {}

    async findSavedPostsByUserId(userId: string) {
        return await this.savePostsDataSource.findOneWithPopulate({ userId }, this.populatedArray);
    }

    async findSavedPostsById(savedPostsId: string) {
        return await this.savePostsDataSource.findByIdWithPopulate(savedPostsId, this.populatedArray);
    }

    async isSavedPostsExist(userId: string) {
        const isSavedPostsExist = await this.findSavedPostsByUserId(userId);
        if (!isSavedPostsExist) {
            throw new ApiError(`لا يوجد أي منشورات محفوظة لهذا المستخدم`, NOT_FOUND);
        }
        return isSavedPostsExist;
    }

    async createNewSavedPosts(userId: string)  {
        try {
            return await this.savePostsDataSource.createOne({ userId });
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت العملية', INTERNAL_SERVER_ERROR)
        }
    }

    async addPostToSavePosts({ userId, postId }: { userId: string; postId: string } )  {
        try {
            let savedPosts = await this.findSavedPostsByUserId(userId) as ISavedPostsModel;
            if (!savedPosts) {
                savedPosts = await this.createNewSavedPosts(userId);
                if(!savedPosts) throw new ApiError('فشلت عملية حفظ المنشور', INTERNAL_SERVER_ERROR)
            }

            const isPostExist = await postService.isPostExist(postId);

            const isPostExistInSavedPosts = savedPosts.posts.some((p) => p.toString() === postId.toString());
            if (isPostExistInSavedPosts) {
                throw new ApiError('هذا المنشور محفوظ بالفعل', CONFLICT);
            }
            const newPosts = [ ... savedPosts.posts, postId ];
            return await this.savePostsDataSource.updateOne({ userId, _id: savedPosts._id }, { posts: newPosts }, this.populatedArray) 
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية حفظ المنشور', INTERNAL_SERVER_ERROR)
        }
    }

    async deletePostFromSavedPosts({ userId, postId }: { userId: string, postId: string}) {
        try { 
            const savedPostsExist = await this.isSavedPostsExist(userId);

            let savedPosts = savedPostsExist.posts.filter((p) => p.toString() !== postId.toString());
            return await this.savePostsDataSource.updateOne({ userId, _id: savedPostsExist._id }, { posts: savedPosts}, this.populatedArray) 
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية حذف المنشور من المحفوظات', INTERNAL_SERVER_ERROR)
        }
    }
    
    async deleteAllPostsFromSavedPosts(userId: string) {
        try { 
            const savedPostsExist = await this.isSavedPostsExist(userId);
            return await this.savePostsDataSource.updateOne({ userId, _id: savedPostsExist._id }, { posts: [] }, this.populatedArray) 
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشلت عملية حذف المنشورات من المحفوظات', INTERNAL_SERVER_ERROR)
        }
    }
}

export const savedPostsService = new SavedPostsService(); 