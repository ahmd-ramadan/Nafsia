import { SessionStatus } from "../enums";
import { ICreateReviewQuery } from "../interfaces";
import { reviewRepository } from "../repositories";
import { ApiError, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, pagenation, UNAUTHORIZED } from "../utils";
import { doctorService } from "./doctor.service";
import { sessionService } from "./session.service";

class ReviewService {

    private readonly populatedArray = ['doctortData', 'userData'];

    constructor(private readonly reviewDataSource = reviewRepository){}

    async findReviewById(reviewId: string){
        return await this.reviewDataSource.findByIdWithPopulate(reviewId, this.populatedArray);
    }

    async isReviewExist(reviewId: string){
        const isReviewExist = await this.findReviewById(reviewId);
        if (!isReviewExist) {
            throw new ApiError('هذا المراجعة غير موجودة', NOT_FOUND)
        }
        return isReviewExist;
    }

    async userCanReview({ userId, doctorId }: { userId: string, doctorId: string }){
        //! check if user alredy have review on this doctor
        const isReviewExist = await this.reviewDataSource.findOne({ userId, doctorId });
        if (isReviewExist) {
            throw new ApiError('لديك مراجعة لهذا الدكتور .. لايمكن إضافة المزيد', CONFLICT);
        }
        
        //! check if user have session with this doctor or no
        const haveSessions = await sessionService.findMany({
            participations: userId,
            doctorId,
        });
          
        if (!haveSessions || haveSessions.length <= 0) {
            throw new ApiError('ليس لديك أي جلسة مع هذا الدكتور .. لايمكنك إجراء مراجعة', CONFLICT)
        }
        const isHaveCompletedSession = haveSessions.some(s => s.status === SessionStatus.COMPLETED);
        if (!isHaveCompletedSession) {
            throw new ApiError('ليس لديك جلسة مكتملة مع هذا الدكتور .. لايمكنك إجراء مراجعة', CONFLICT)
        }

        return true;
    }

    async addNewReview(data: ICreateReviewQuery) {
        try {
            const { doctorId, userId } = data;

            //! user can review
            await this.userCanReview({ userId, doctorId });

            //! create review
            const newReview = await this.reviewDataSource.createOne(data, this.populatedArray);
            if (!newReview) {
                throw new Error();
            } 

            //! update review rating
            await doctorService.updateDoctorRating(doctorId);

            return newReview;
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشل عملية لإضافة مراجعة', INTERNAL_SERVER_ERROR);
        }
    }

    async getAllReviewsForDoctor(doctorId: string) {
        return await this.reviewDataSource.find({ doctorId });
    }

    async updateReview({ reviewId, userId, data: { comment, rating } }: { reviewId: string, userId: string, data: { comment?:string, rating?: number } }) {
        try {
            //! review is exist
            const isReviewExist = await this.isReviewExist(reviewId);

            if (isReviewExist?.userId.toString() !== userId.toString()) {
                throw new ApiError('لا تستطيع تحديث هذه المراجعة', UNAUTHORIZED)
            }
            
            //! update review
            let updatedData: any = {};
            if (rating) updatedData.rating = rating;
            if (comment) updatedData.comment = comment;
            const updatedReview = await this.reviewDataSource.updateOne({ _id: reviewId, userId }, updatedData, this.populatedArray)
            if (!updatedReview) {
                throw new Error()
            }

            //! update doctor rating
            await doctorService.updateDoctorRating(updatedReview.doctorId);

            return updatedReview;
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشل عملية تحديث المراجعة', INTERNAL_SERVER_ERROR);
        }
    }

    async deleteReview({ reviewId, userId }: { reviewId: string, userId: string }) {
        try {
            //! review is exist
            const isReviewExist = await this.isReviewExist(reviewId);

            if (isReviewExist?.userId.toString() !== userId.toString()) {
                throw new ApiError('لا تستطيع حذف هذه المراجعة', UNAUTHORIZED)
            }
            //! delete review
            const deletedReview = await this.reviewDataSource.deleteOne({ _id: reviewId })
            if (!deletedReview) {
                throw new Error()
            }

            //! update doctor rating
            await doctorService.updateDoctorRating(isReviewExist.doctorId);

            return true;
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشل عملية حذف المراجعة', INTERNAL_SERVER_ERROR);
        }
    }

    async getAllReview(
            { doctorId, userId, pageSize, pageNumber }: 
            { doctorId?: string; userId?: string; pageSize: number; pageNumber: number  }) {
        try {
            
            let query: any = {};
            if (doctorId) query.doctorId = doctorId;
            if (userId) query.userId = userId;

            const { skip, limit } = pagenation({ page: pageNumber, size: pageSize });

            return await this.reviewDataSource.findWithPopulate(query, this.populatedArray, { limit, skip });
        } catch(error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('فشل عملية إرجاع المراجاعات', INTERNAL_SERVER_ERROR);
        }
    }
}

export const reviewService = new ReviewService();