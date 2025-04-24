
import { Review } from "../models";
import { IReviewModel, IReview } from "../interfaces";
import GeneralRepository from "./general.repository";

export const reviewRepository = new GeneralRepository<IReviewModel, IReview>(Review)