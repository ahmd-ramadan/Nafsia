import { ICreateDoctorQuery, IDoctorModel } from "../interfaces";
import { doctorRepository } from "../repositories";
import { reviewService } from "./review.service";

class DoctorService {

    constructor(private readonly doctorDataSource = doctorRepository) {}

    async findDoctorByUserId(userId: string) {
        return await this.doctorDataSource.findOne({ userId })
    }

    async createNewDoctor(data: ICreateDoctorQuery) {
        return await this.doctorDataSource.createOne(data)
    }

    async updateOne({ userId, data }: { userId: string, data: Partial<IDoctorModel> }) {
        return await this.doctorDataSource.updateOne({ userId }, data)
    }

    async updateDoctorRating(doctorId: string) {
        //! get all reviews on product & clac sum of rates
        const reviews = await reviewService.getAllReviewsForDoctor(doctorId);
        
        let sumOfRates = 0;
        for(const review of reviews) sumOfRates += review.rating;
        const newRating = Number(sumOfRates / reviews.length || 1).toFixed(2);
        
        return await this.doctorDataSource.updateOne({ userId: doctorId }, { rate: newRating });
    }

    async findDoctorById(userId: string) {
        return await this.doctorDataSource.findById(userId)
    }
}

export const doctorService = new DoctorService();