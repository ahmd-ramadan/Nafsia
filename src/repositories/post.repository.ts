import { Post } from "../models";
import { IPostModel, IPost } from "../interfaces";
import GeneralRepository from "./general.repository";

export const postRepository = new GeneralRepository<IPostModel, IPost>(Post)