import { Router, Request, Response } from "express"
import { testingDeleteAllVideos } from "./video-router"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { AuthorizationRepository } from "../repositories/authorizationRepository"
import { authorizationRepository, blogRepository, commentRepository, postRepository, userRepository } from "../composition-root"

export const testingRouter = Router({})

testingRouter.delete('/', async (req: Request, res: Response) => {
    testingDeleteAllVideos()
    await blogRepository.testingDeleteAllBlogs()
    await postRepository.testingDeleteAllPosts()
    await userRepository.testingDeleteAllUsers()
    await commentRepository.testingDeleteAllComments()
    await authorizationRepository.testingDeleteAllDevices()
    res.status(HttpStatusCode.NO_CONTENT_204).send('All data is deleted') 
})