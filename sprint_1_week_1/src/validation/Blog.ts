import { body } from "express-validator"

export const validateBlog = [
    body('name').isString().trim().isLength({min: 1, max: 15}),
    body('description').isString().trim().isLength({min: 1, max: 500}),
    body('websiteUrl').isString().isLength({min: 1, max: 100}).isURL().matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
]