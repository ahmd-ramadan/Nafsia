import { ICreateMeasurementQuery } from "../interfaces";
import { measurementRepository } from "../repositories";
import { ApiError, INTERNAL_SERVER_ERROR } from "../utils";


export class MeasurementService {
    constructor(
        private readonly measurementDataSource = measurementRepository,
    ) {}

    async createOne({ userId, data }: { userId: string, data: ICreateMeasurementQuery }) {
        try {
            return this.measurementDataSource.createOne({ userId, ... data});
        } catch(error) {
            throw new ApiError('حدث خطأأثناء إضافة القيايات للمستخدم', INTERNAL_SERVER_ERROR)
        }
    }

    async getAllMeasurementsForUser({ userId }: { userId: string }) {
        try {
            return this.measurementDataSource.find({ userId });
        } catch(error) {
            throw new ApiError('حدث خطأأثناء إرجاع القيايات للمستخدم', INTERNAL_SERVER_ERROR)
        }
    }

   
}

export const measurementService = new MeasurementService();