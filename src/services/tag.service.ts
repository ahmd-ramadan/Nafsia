import { ICreateTagQuery } from "../interfaces";
import { tagRepository } from "../repositories";
import { ApiError, CONFLICT, NOT_FOUND } from "../utils";

class TagService {
    constructor(
        private readonly tagDataSource = tagRepository,
    ) {}

    async createOne(data: ICreateTagQuery) {
        const isTagExist = await this.findTagByName(data.name);
        if (isTagExist) {
            throw new ApiError('إسم الوسم موجود, أضف إسما غيره', CONFLICT);
        }
        return this.tagDataSource.createOne(data);
    }

    async findTagByName(name: string) {
        return this.tagDataSource.findOne({ name });
    }

    async find(query: any) {
        return this.tagDataSource.find(query);
    }

    async isTagExist(tagId: string) {
        const isTagExist = await this.tagDataSource.findById(tagId);
        if (!isTagExist) {
            throw new ApiError('الوسم غير موجود', NOT_FOUND);
        }
        return isTagExist;
    }

    async updateOne({ tagId, name }: { tagId: string; name: string }) {
        const isTagExist = await this.isTagExist(tagId);
        const isTagNameExist = await this.findTagByName(name);
        if (isTagExist._id.toString() !== isTagNameExist?._id.toString()) {
            throw new ApiError('إسم الوسم موجود, أضف إسما غيره', CONFLICT);
        }
        return this.tagDataSource.updateOne({ _id: tagId }, { name }); 
    }

    async deleteOne(tagId: string) {
        const isTagExist = await this.isTagExist(tagId);
        return this.tagDataSource.deleteOne({ _id: tagId });
    }
}

export const tagService = new TagService();