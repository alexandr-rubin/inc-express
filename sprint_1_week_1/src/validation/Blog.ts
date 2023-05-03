import { body } from "express-validator"

export const postBlog = [
    body('name').isLength({min: 1, max: 15}),
    body('description').isLength({min: 1, max: 500}),
    body('websiteUrl').isLength({min: 1, max: 100}).isURL().matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
]