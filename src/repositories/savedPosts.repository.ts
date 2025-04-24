
import { SavedPosts } from "../models";
import { ISavedPostsModel, ISavedPosts } from "../interfaces";
import GeneralRepository from "./general.repository";

export const savedPostsRepository = new GeneralRepository<ISavedPostsModel, ISavedPosts>(SavedPosts)