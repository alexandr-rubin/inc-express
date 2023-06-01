import { body } from "express-validator"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"

export const validateConfirmationCode = [
    body('code').notEmpty().isString().custom(async code => {
        const user = await userQueryRepository.findUserByConfirmationCode(code)
        if (!user) {
            throw new Error('Wrong confirmation code')
        }
    }),
    body('code').notEmpty().isString().custom(async code => {
        const user = await userQueryRepository.findUserByConfirmationCode(code)
        if (user && user.confirmationEmail.isConfirmed) {
            throw new Error('User wit email: ' + user.email + ' is already registered')
        }
    })
]