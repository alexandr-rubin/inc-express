import { body } from "express-validator"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"

export const validateRecoveryPassword = [
    body('newPassword').notEmpty().isString().trim().isLength({min: 6, max: 20}),
    body('recoveryCode').notEmpty().isString().custom(async code => {
        const user = await userQueryRepository.findUserByConfirmationPasswordCode(code)
        if (!user) {
            throw new Error('Error')
        }
    }),
]