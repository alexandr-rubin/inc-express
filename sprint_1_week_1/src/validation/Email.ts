import { body } from "express-validator"
import { UserQueryRepository } from "../queryRepositories/userQuertyRepository"

export const validateEmail = [
    body('email').notEmpty().isString().isEmail()
]