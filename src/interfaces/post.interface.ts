import { ICloudinaryIMage } from "./cloudinary.interface"
import { IDBModel } from "./database.interface"
import { IReact } from "./react.interface"
import { ITagModel } from "./tag.interface"
import { IUser } from "./user.interface"

export interface IPostModel extends IDBModel {
    doctorId: string,
    tags: string[],
    title: string,
    content: string,
    images: ICloudinaryIMage[]
}

export interface IPost extends IPostModel {
    tagsData: ITagModel[],
    doctorData: IUser[],
    reactionsData: IReact[]
}

export interface ICreatePostQuery {
    doctorId: string,
    tags: string [],
    title: string,
    content: string,
    images: ICloudinaryIMage[]
}

export interface IUpdatePostQuery {
    tags: string [],
    title: string,
    content: string,
    oldPublicIds: string[]
}