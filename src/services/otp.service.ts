import { ICreateOtpQuery } from '../interfaces';
import { otpRepository } from '../repositories';
import { logger } from '../utils';
import cron from 'node-cron'

export class OtpService {
    constructor(
        private readonly otpDataSource = otpRepository,
    ) {}

    async createOne(data: ICreateOtpQuery) {
        return this.otpDataSource.createOne(data);
    }

    async findOne(query: any) {
        return this.otpDataSource.findOne(query);
    }

    async deleteOne(query: any) {
        return this.otpDataSource.deleteOne(query);
    }

    async deleteExpiredOtps() {
        const now = new Date();

        return this.otpDataSource.deleteMany({ expiresAt: { lt: now } });
    }

    scheduleOtpCleanupTask() {
        cron.schedule('0 0 * * *', () => {
            logger.info('Cleanup otpss cron job started 🕛');
            this.deleteExpiredOtps()
                .then(() => {
                    logger.info('Cleanup otps cron job completed ✅');
                })
                .catch((error) => {
                    logger.error('Cleanup otps cron job failed ❌', error);
                });
        });
    }
}

export const otpService = new OtpService();