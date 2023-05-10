import { Router, Request, Response } from "express"
import { blogRepository } from "../repositories/blog-respository"
import { validateBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await blogRepository.getBlogs())
})

blogsRouter.post('/', validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    return res.status(201).send(await blogRepository.addBlog(req.body))
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogRepository.getBlogById(req.params.id)
    if(blog) {
        res.status(200).send(blog)
    }
    else{
        res.status(404).send('Blog not found')
    }
})

blogsRouter.put('/:id', validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    const blog = await blogRepository.updateBlogById(req.params.id, req.body)
    if(blog){
        return res.sendStatus(204)
    }
    return res.status(404).send('Not found')
})

blogsRouter.delete('/:id', async (req: Request, res: Response) => {
    if(await blogRepository.deleteBlogById(req.params.id)) {
        res.status(204).send('Blog deleted')
    }
    else{
        res.status(404).send('Blog not found')
    }
})