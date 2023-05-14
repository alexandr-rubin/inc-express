import { Router, Request, Response } from "express"
import { validateBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { blogService } from "../domain/blogs-service"
import { validatePost, validatePostForBlog } from "../validation/Post"

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await blogService.getBlogs(req))
})

blogsRouter.post('/', validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    return res.status(201).send(await blogService.addBlog(req.body))
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogService.getBlogById(req.params.id)
    if(blog) {
        res.status(200).send(blog)
    }
    else{
        res.status(404).send('Blog not found')
    }
})

blogsRouter.put('/:id', validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    const blog = await blogService.updateBlogById(req.params.id, req.body)
    if(blog){
        return res.sendStatus(204)
    }
    return res.status(404).send('Not found')
})

blogsRouter.delete('/:id', async (req: Request, res: Response) => {
    if(await blogService.deleteBlogById(req.params.id)) {
        res.status(204).send('Blog deleted')
    }
    else{
        res.status(404).send('Blog not found')
    }
})

blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
    res.status(200).send(await blogService.getPostsForSpecifiedBlog(req.params.blogId,req))
})

blogsRouter.post('/:blogId/posts', validatePostForBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    return res.status(201).send(await blogService.addPostForSpecificBlog(req.params.blogId, req.body))
})