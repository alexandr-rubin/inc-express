import { body } from "express-validator"
import { blogRepository } from "../repositories/blog-respository"

export const validatePost = [
    body('title').isString().trim().isLength({min: 1, max: 30}),
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    body('content').isString().trim().isLength({min: 1, max: 1000}),
    body('blogId').isString().custom(async id => {
        const blog = await blogRepository.getBlogById(id)
        if (!blog) {
            throw new Error('Blog not found')
        }
    })
]