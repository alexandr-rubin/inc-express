import { body } from "express-validator"

export const validateUser = [
    body('login').notEmpty().isString().trim().isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$'),
    body('password').notEmpty().isString().trim().isLength({min: 6, max: 20}),
    body('email').notEmpty().isString().isEmail()/*('/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/')*/
]