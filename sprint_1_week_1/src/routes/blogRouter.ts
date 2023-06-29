import { Router, Request, Response } from "express"
import { validateBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { BlogService } from "../domain/blogsService"
import { validatePostForBlog } from "../validation/Post"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { BlogQueryRepository } from "../queryRepositories/blogQueryRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { blogQueryRepository, blogService } from "../composition-root"

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    return res.status(HttpStatusCode.OK_200).send(await blogQueryRepository.getBlogs(req))
})

blogsRouter.post('/', basicAuthMiddleware, validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await blogService.addBlog(req.body)
    return res.status(HttpStatusCode.CREATED_201).send(result)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogQueryRepository.getBlogById(req.params.id)
    if(!blog) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
    }
    return res.status(HttpStatusCode.OK_200).send(blog)
})

blogsRouter.put('/:id', basicAuthMiddleware, validateBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    const isUpdated = await blogService.updateBlogById(req.params.id, req.body)
    if(!isUpdated){
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Not found')
    }
    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await blogService.deleteBlogById(req.params.id)
    if(!isDeleted) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send('Blog deleted')
})

blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
    const posts = await blogQueryRepository.getPostsForSpecifiedBlog(req.params.blogId,req)
    if(posts === null) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
    }
    
    return res.status(HttpStatusCode.OK_200).send(posts)
})

blogsRouter.post('/:blogId/posts', basicAuthMiddleware, validatePostForBlog, validationErrorsHandler, async (req: Request, res: Response) => {
    const post = await blogService.addPostForSpecificBlog(req.params.blogId, req.body)
    if(post === null) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
    }

    return res.status(HttpStatusCode.CREATED_201).send(post)
})