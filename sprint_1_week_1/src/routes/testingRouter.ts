import { Router, Request, Response } from "express"
import { testingDeleteAllVideos } from "./video-router"
import { blogRepository } from "../repositories/blogRespository"
import { postRepository } from "../repositories/postRespository"

export const testingRouter = Router({})

testingRouter.delete('/', (req: Request, res: Response) => {
    testingDeleteAllVideos()
    blogRepository.testingDeleteAllBlogs()
    postRepository.testingDeleteAllPosts()
    res.status(204).send('All data is deleted') 
})