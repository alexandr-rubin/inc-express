import { Router, Request, Response } from "express"
import { testingDeleteAllVideos } from "./video-router"
import { blogRepository } from "../repositories/blogRespository"
import { postRepository } from "../repositories/postRespository"
import { userRepository } from "../repositories/userRepository"
import { commentRepository } from "../repositories/commentRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"

export const testingRouter = Router({})

testingRouter.delete('/', async (req: Request, res: Response) => {
    testingDeleteAllVideos()
    await blogRepository.testingDeleteAllBlogs()
    await postRepository.testingDeleteAllPosts()
    await userRepository.testingDeleteAllUsers()
    await commentRepository.testingDeleteAllComments()
    res.status(HttpStatusCode.NO_CONTENT_204).send('All data is deleted') 
})