import { Router, Request, Response } from "express"
import { blogRepository } from "../repositories/blog-respository"
import { postBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"

export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(blogRepository.getBlogs())
})
blogsRouter.post('/', postBlog, validationErrorsHandler, (req: Request, res: Response) => {
    return res.status(201).send(blogRepository.addBlog(req.body))
})