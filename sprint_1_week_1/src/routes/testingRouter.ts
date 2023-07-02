import { Router, Request, Response } from "express"
import { testingDeleteAllVideos } from "./video-router"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { AuthorizationRepository } from "../repositories/authorizationRepository"
import { container } from "../composition-root"
import { BlogRepository } from "../repositories/blogRespository"
import { PostRepository } from "../repositories/postRespository"
import { UserRepository } from "../repositories/userRepository"
import { CommentRepository } from "../repositories/commentRepository"

const blogRepository = container.resolve(BlogRepository)
const postRepository = container.resolve(PostRepository)
const userRepository = container.resolve(UserRepository)
const commentRepository = container.resolve(CommentRepository)
const authorizationRepository = container.resolve(AuthorizationRepository)

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