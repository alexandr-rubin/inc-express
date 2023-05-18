import { body } from "express-validator"

export const validateLogin = [
    body('loginOrEmail').notEmpty().isString().trim().isLength({min: 3, max: 256}),
    body('password').notEmpty().isString().trim().isLength({min: 6, max: 20})
]