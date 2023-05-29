import { body } from "express-validator"

export const validateEmail = [
    body('email').notEmpty().isString().isEmail()
]