import { Router, Request, Response } from "express"
import { validateBlog } from "../validation/Blog"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { BlogService } from "../domain/blogsService"
import { validatePostForBlog } from "../validation/Post"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { BlogQueryRepository } from "../queryRepositories/blogQueryRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { container } from "../composition-root"
import { BlogController } from "../controllers/blogController"

const blogController = container.resolve(BlogController)

export const blogsRouter = Router({})

blogsRouter.get('/', blogController.getBlogs.bind(blogController))

blogsRouter.post('/', basicAuthMiddleware, validateBlog, validationErrorsHandler, blogController.postBlog.bind(blogController))

blogsRouter.get('/:id', blogController.getBlogById.bind(blogController))

blogsRouter.put('/:id', basicAuthMiddleware, validateBlog, validationErrorsHandler, blogController.putBlog.bind(blogController))

blogsRouter.delete('/:id', basicAuthMiddleware, blogController.deleteBlog.bind(blogController))

blogsRouter.get('/:blogId/posts', blogController.getPostsForSpecBlog.bind(blogController))

blogsRouter.post('/:blogId/posts', basicAuthMiddleware, validatePostForBlog, validationErrorsHandler, blogController.addPostForSpecBlog.bind(blogController))