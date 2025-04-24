import { tagService } from '../services';
import {
  CREATED,
  OK
} from '../utils';
import { AuthenticatedRequest } from '../interfaces';
import { toTagSchema, paramsSchema } from '../validation';
import { Response } from 'express';

export const createTag = async (req: AuthenticatedRequest, res: Response) => {
    const { name } = toTagSchema.parse(req.body);
    const adminId = req.user?.userId as string;

    const newTag = await tagService.createOne({ name, adminId });

    res.status(CREATED).json({
        success: true,
        message: 'تم إضافة الوسم بنجاح!', 
        data: newTag 
    });
};

export const getTag = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: tagId } = paramsSchema.parse(req.params);

    const tag = await tagService.isTagExist(tagId);

    res.status(OK).json({ 
        success: true,
        message: '', 
        data: tag 
    });
};

export const getAllTags = async (req: AuthenticatedRequest, res: Response) => {
    // const { sortBy, order } = sortSchema.parse(req.query);
    // const validColumns = Object.values(DB_COLUMNS.TAG);
    // const sortFields = sortBy?.split(',') || [];
    // const sortOrders = order?.split(',') || [];

    // const invalidFields = sortFields.filter(
    //     (field) => !validColumns.includes(field),
    // );
    // if (invalidFields.length > 0) {
    //     res.status(BAD_REQUEST).json({
    //     message: `Invalid sort field(s): ${invalidFields.join(', ')}. Allowed fields: ${validColumns.join(', ')}`,
    //     });
    //     return;
    // }

    // const orderBy: ISortQuery = sortFields.map((field, index) => ({
    //     [field]: sortOrders[index] === 'desc' ? 'desc' : 'asc',
    // }));

    // const tags = await tagService.findMany(
    //     { userUuid: req.user?.uuid as string },
    //     orderBy.length > 0 ? orderBy : undefined,
    // );

    const tags = await tagService.find({}); 
    res.status(OK).json({ 
        success: true,
        message: '', 
        data: tags 
    });
};

export const updateTag = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: tagId } = paramsSchema.parse(req.params);
    const { name } = toTagSchema.parse(req.body);

    const updatedTag = await tagService.updateOne({ tagId,  name });

    res.status(OK).json({ 
        success: true,
        message: 'تم تحديث الوسم بنجاح!',
        data: updateTag 
    });
};

export const deleteTag = async (req: AuthenticatedRequest, res: Response) => {
    const { _id: tagId } = paramsSchema.parse(req.params);

    await tagService.deleteOne(tagId);

    res.status(OK).json({
        success: true,
        message: 'تم حذف الوسم بنجاح',
        data: { tagId }
    })
};