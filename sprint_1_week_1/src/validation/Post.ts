import { body } from "express-validator"
import { blogRepository } from "../repositories/blog-respository"
import { ObjectId } from 'mongodb'

export const validatePost = [
    body('title').notEmpty().isString().trim().isLength({min: 1, max: 30}),
    body('shortDescription').notEmpty().isString().trim().isLength({min: 1, max: 100}),
    body('content').notEmpty().isString().trim().isLength({min: 1, max: 1000}),
    body('blogId').notEmpty().isString().custom(async id => {
        const blog = await blogRepository.getBlogById(new ObjectId(id))
        if (!blog) {
            throw new Error('Blog not found')
        }
    })
]