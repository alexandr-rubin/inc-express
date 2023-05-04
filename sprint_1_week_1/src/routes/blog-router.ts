import { Router, Request, Response } from "express"
import { blogRepository } from "../repositories/blog-respository"
import { validateBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"

export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(blogRepository.getBlogs())
})

blogsRouter.post('/', validateBlog, validationErrorsHandler, (req: Request, res: Response) => {
    return res.status(201).send(blogRepository.addBlog(req.body))
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blog = blogRepository.getBlogById(req.params.id)
    if(blog !== undefined) {
        res.status(200).send(blog)
    }
    else{
        res.status(404).send('Blog not found')
    }
})

blogsRouter.put('/:id', validateBlog, validationErrorsHandler, (req: Request, res: Response) => {
    return res.status(204).send(blogRepository.updateBlogById(req.params.id, req.body))
})

blogsRouter.delete('/:id', (req: Request, res: Response) => {
    if(blogRepository.deleteBlogById(req.params.id)) {
        res.status(204).send('Blog deleted')
    }
    else{
        res.status(404).send('Blog not found')
    }
})