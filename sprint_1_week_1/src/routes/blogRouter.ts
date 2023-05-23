import { Router, Request, Response } from "express"
import { validateBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { blogService } from "../domain/blogsService"
import { validatePost, validatePostForBlog } from "../validation/Post"
import { basicAuthMiddleware } from "../middlewares/basicAuth"

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    return res.status(200).send(await blogService.getBlogs(req))
})

blogsRouter.post('/', basicAuthMiddleware, validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    return res.status(201).send(await blogService.addBlog(req.body))
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogService.getBlogById(req.params.id)
    if(blog) {
        return res.status(200).send(blog)
    }
    return res.status(404).send('Blog not found')
})

blogsRouter.put('/:id', basicAuthMiddleware, validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    const blog = await blogService.updateBlogById(req.params.id, req.body)
    if(blog){
        return res.sendStatus(204)
    }
    return res.status(404).send('Not found')
})

blogsRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    if(await blogService.deleteBlogById(req.params.id)) {
        return res.status(204).send('Blog deleted')
    }
    return res.status(404).send('Blog not found')
})

blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
    const posts = await blogService.getPostsForSpecifiedBlog(req.params.blogId,req)
    if(posts === null) {
        return res.status(404).send('Blog not found')
    }
    
    return res.status(200).send(posts)
})

blogsRouter.post('/:blogId/posts', basicAuthMiddleware, validatePostForBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    const post = await blogService.addPostForSpecificBlog(req.params.blogId, req.body)
    if(post === null) {
        return res.status(404).send('Blog not found')
    }

    return res.status(201).send(post)
})