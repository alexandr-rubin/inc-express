import { body, param } from "express-validator"
import { BlogRepository } from "../repositories/blogRespository"
import { BlogQueryRepository } from "../queryRepositories/blogQueryRepository"

const blogQueryRepositoryInst = new BlogQueryRepository()

export const validatePost = [
    body('title').notEmpty().isString().trim().isLength({min: 1, max: 30}),
    body('shortDescription').notEmpty().isString().trim().isLength({min: 1, max: 100}),
    body('content').notEmpty().isString().trim().isLength({min: 1, max: 1000}),
    body('blogId').notEmpty().isString().custom(async id => {
        const blog = await blogQueryRepositoryInst.getBlogById(id)
        if (!blog) {
            throw new Error('Blog not found')
        }
    })
]

export const validatePostForBlog = [
    body('title').notEmpty().isString().trim().isLength({min: 1, max: 30}),
    body('shortDescription').notEmpty().isString().trim().isLength({min: 1, max: 100}),
    body('content').notEmpty().isString().trim().isLength({min: 1, max: 1000})
]