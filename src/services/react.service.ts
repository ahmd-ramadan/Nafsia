import { React } from '../models/React';
import { ICreateReactQuery, IReact, IReactModel, IUser } from '../interfaces';
import { reactRepository } from '../repositories';
import { postService } from './post.service';
import { ApiError, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from '../utils';
import { userService } from './user.service';

class ReactService {

    private readonly populatedArray = ['userData']
    constructor(
        private readonly reactDataSource = reactRepository,
    ) {}

    async isReactExist({ userId, postId }: { userId: string, postId: string }) {
        const isReactExist = await this.findOne({ userId, postId });
        if (!isReactExist ) {
            throw new ApiError('المستخدم ليس لديه تفاعل علي هذا المنشور', NOT_FOUND)
        }
        return isReactExist;
    }

    async addReact(data: ICreateReactQuery) {
        try {
            const { postId, userId } = data;
            const isPostExist = await postService.isPostExist(postId);
            const isReactExist = await this.findOne({ userId, postId });

            if (isReactExist ) {
                throw new ApiError('لديك تفاعل مع هذا البوست بالفعل', CONFLICT)
            }
            return this.reactDataSource.createOne(data);
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            return new ApiError('فشل إضافة ريأكت  للمنشور', INTERNAL_SERVER_ERROR)
        }
    }

    async changeReact(data: ICreateReactQuery) {
        try {
            const { postId, reactType, userId } = data;
            const isPostExist = await postService.isPostExist(postId);
            const isReactExist = await this.isReactExist({ postId, userId })
            return this.reactDataSource.updateOne({ postId, userId }, { reactType });
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            return new ApiError('فشل تغيير الريأكت للمنشور', INTERNAL_SERVER_ERROR)
        }
    }

    async findOne(query: any) {
        return this.reactDataSource.findOne(query);
    }

    async findMany(query: Partial<IReactModel>) {
        return this.reactDataSource.findWithPopulate(query, this.populatedArray);
    }

    async getAllReactsOnPost(postId: string) {
        const reacts = await this.findMany({ postId })
        return await this.formatReactsResponse(reacts);
    }

    async deleteOne({ postId, userId }: { postId: string, userId: string }) {
        try {
            const isPostExist = await postService.isPostExist(postId)
            const isReactExist = await this.isReactExist({ userId, postId })
            return this.reactDataSource.deleteOne({ postId, userId });
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية إلغاء الريأكت علي المنشور', INTERNAL_SERVER_ERROR)
        }
    }

    async deleteMany(query: any) {
        return this.reactDataSource.deleteMany(query);
    }

    async deleteAllReactsOnPost(postId: string) {
        try {
            const isPostExist = await postService.isPostExist(postId)
            return this.reactDataSource.deleteMany({ postId });
        } catch(error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('فشل عملية إلغاء الريأكتس علي المنشور', INTERNAL_SERVER_ERROR)
        }
    }

    async formatReactsResponse(reacts: IReact[]) {
        const reactsResponse = []
        
        for (const { _id, userId, createdAt, reactType, updatedAt } of reacts) {
            const { name, avatar } = await userService.findUserById(userId) as IUser;
            
            const reactResponseObject = {
                _id, 
                userData: {
                    _id: userId,
                    name,
                    avatar
                },
                reactType,
                createdAt,
                updatedAt
            }

            reactsResponse.push(reactResponseObject);
        }
        
        return reactsResponse;
    }

}

export const reactService = new ReactService();