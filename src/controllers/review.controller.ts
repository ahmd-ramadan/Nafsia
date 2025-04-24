import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { addReviewSchema, getAllReviewsQuerySchema, paginationSchema, paramsSchema, updateReviewSchema } from "../validation";
import { reviewService } from "../services";
import { CREATED, OK } from "../utils";

export const addReview = async(req: AuthenticatedRequest, res: Response) => {
    const data = addReviewSchema.parse(req.body);
    const userId = req.user?.userId as string;

    const newReview = await reviewService.addNewReview({ ... data, userId });

    res.status(CREATED).json({
        success: true,
        message: 'تم إضافة المراجعة بنجاح',
        data: newReview
    })
}

export const updateReview = async(req: AuthenticatedRequest, res: Response) => {
    const data = updateReviewSchema.parse(req.body);
    const { _id: reviewId } = paramsSchema.parse(req.params);
    const userId = req?.user?.userId as string;

    const updatedReview = await reviewService.updateReview({ data, reviewId, userId });

    res.status(OK).json({
        success: true,
        message: 'تم تحديث المراجعة بنجاح',
        data: updateReview
    })
}   

export const deleteReview = async(req: AuthenticatedRequest, res: Response) => {
    const { _id: reviewId } = paramsSchema.parse(req.params);
    const userId = req?.user?.userId as string;
    
    await reviewService.deleteReview({ reviewId, userId });

    res.status(OK).json({
        success: true,
        message: 'تم حذف المراجعة بنجاح',
        data: { reviewId }
    })
}  

export const getAllReviews = async(req: AuthenticatedRequest, res: Response) => {
    const { doctorId, userId } = getAllReviewsQuerySchema.parse(req.query);
    const { pageNumber, pageSize } = paginationSchema.parse(req.query);
    
    const allReviews = await reviewService.getAllReview({ doctorId, userId, pageNumber, pageSize });

    res.status(OK).json({
        success: true,
        message: 'تم إرجاع المراجاعات بنجاح',
        data: allReviews
    })
}   
