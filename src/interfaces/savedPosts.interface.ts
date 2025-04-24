import { IDBModel } from "./database.interface";
import { IPost } from "./post.interface";
import { IUser } from "./user.interface";

export interface ISavedPostsModel extends IDBModel {
    userId: string;
    posts: string[]
}

export interface ISavedPosts extends ISavedPostsModel {
    userData: IUser,
    productsData: IPost[]
}

export interface IAddPostToSavedPostsQuery {
   userId: string;
   postId: string,
}