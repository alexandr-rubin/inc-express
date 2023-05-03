import { Router, Request, Response } from "express"
import { postRepository } from "../repositories/post-respository"

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(postRepository.getPosts())
})