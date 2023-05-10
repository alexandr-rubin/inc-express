import { body } from "express-validator"

export const validateBlog = [
    body('name').notEmpty().isString().trim().isLength({min: 1, max: 15}),
    body('description').notEmpty().isString().trim().isLength({min: 1, max: 500}),
    body('websiteUrl').notEmpty().isString().isLength({min: 1, max: 100}).matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
]