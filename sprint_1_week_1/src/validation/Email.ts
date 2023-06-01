import { body } from "express-validator"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"

export const validateEmail = [
    body('email').notEmpty().isString().isEmail().custom(async email => {
        const user = await userQueryRepository.getUserByEmail(email)
        if (!user) {
            throw new Error('Wrong email')
        }
    }),
    body('email').notEmpty().isString().isEmail().custom(async email => {
        const user = await userQueryRepository.getUserByEmail(email)
        if (user && user.confirmationEmail.isConfirmed) {
            throw new Error('User wit email: ' + user.email + ' is already registered')
        }
    })
]