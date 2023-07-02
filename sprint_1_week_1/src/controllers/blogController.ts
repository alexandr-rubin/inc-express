import { Router, Request, Response } from "express"
import { validateBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { BlogService } from "../domain/blogsService"
import { validatePostForBlog } from "../validation/Post"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { BlogQueryRepository } from "../queryRepositories/blogQueryRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { injectable } from "inversify"
import { container } from "../composition-root"

@injectable()
export class BlogController {
    constructor(protected blogQueryRepository: BlogQueryRepository, protected blogService: BlogService){}
    async getBlogs(req: Request, res: Response) {
        return res.status(HttpStatusCode.OK_200).send(await this.blogQueryRepository.getBlogs(req))
    }
    async postBlog(req: Request, res: Response) {
        const result = await this.blogService.addBlog(req.body)
        return res.status(HttpStatusCode.CREATED_201).send(result)
    }
    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogQueryRepository.getBlogById(req.params.id)
        if(!blog) {
            return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
        }
        return res.status(HttpStatusCode.OK_200).send(blog)
    }
    async putBlog(req: Request, res: Response) {
        const isUpdated = await this.blogService.updateBlogById(req.params.id, req.body)
        if(!isUpdated){
            return res.status(HttpStatusCode.NOT_FOUND_404).send('Not found')
        }
        return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
    }
    async deleteBlog(req: Request, res: Response) {
        const isDeleted = await this.blogService.deleteBlogById(req.params.id)
        if(!isDeleted) {
            return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
        }
        return res.status(HttpStatusCode.NO_CONTENT_204).send('Blog deleted')
    }
    async getPostsForSpecBlog(req: Request, res: Response) {
        const posts = await this.blogQueryRepository.getPostsForSpecifiedBlog(req.params.blogId,req)
        if(posts === null) {
            return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
        }
        
        return res.status(HttpStatusCode.OK_200).send(posts)
    }
    async addPostForSpecBlog(req: Request, res: Response) {
    const post = await this.blogService.addPostForSpecificBlog(req.params.blogId, req.body)
    if(post === null) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Blog not found')
    }

    return res.status(HttpStatusCode.CREATED_201).send(post)
}
}