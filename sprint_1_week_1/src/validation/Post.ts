import { body } from "express-validator"
import { blogRepository } from "../repositories/blog-respository"

export const validatePost = [
    body('title').isLength({min: 1, max: 30}),
    body('shortDescription').isLength({min: 1, max: 100}),
    body('content').isLength({min: 1, max: 1000}),
    body('blogId').custom(async id => {
        const blog = await blogRepository.getBlogById(id)
        if (!blog) {
            throw new Error('Blog not found')
        }
    })
]