import { body } from "express-validator"

export const validateConfirmationCode = [
    body('login').notEmpty().isString()
]