import { body } from "express-validator"

export const validateBlog = [
    body('name').trim().isLength({min: 1, max: 15}),
    body('description').trim().isLength({min: 1, max: 500}),
    body('websiteUrl').isLength({min: 1, max: 100}).isURL().matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
]