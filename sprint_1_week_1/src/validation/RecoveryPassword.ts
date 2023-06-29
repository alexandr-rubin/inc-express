import { body } from "express-validator"
import { UserQueryRepository } from "../queryRepositories/userQuertyRepository"

const userQueryRepositoryInst = new UserQueryRepository()

export const validateRecoveryPassword = [
    body('newPassword').notEmpty().isString().trim().isLength({min: 6, max: 20}),
    body('recoveryCode').notEmpty().isString().custom(async code => {
        const user = await userQueryRepositoryInst.findUserByConfirmationPasswordCode(code)
        if (!user) {
            throw new Error('Error')
        }
    }),
]