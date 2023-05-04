import { Router, Request, Response } from "express"
import { testingDeleteAllVideos } from "./video-router"
import { blogRepository } from "../repositories/blog-respository"
import { postRepository } from "../repositories/post-respository"

export const testingRouter = Router({})

testingRouter.delete('/', (req: Request, res: Response) => {
    testingDeleteAllVideos()
    blogRepository.testingDeleteAllBlogs()
    postRepository.testingDeleteAllPosts()
    res.status(204).send('All data is deleted') 
})