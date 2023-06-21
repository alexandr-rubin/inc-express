import { body } from "express-validator"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"

export const validateEmail = [
    body('email').notEmpty().isString().isEmail()
]