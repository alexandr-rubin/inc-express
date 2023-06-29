import { body } from "express-validator"
import { UserQueryRepository } from "../queryRepositories/userQuertyRepository"

const userQueryRepositoryInst = new UserQueryRepository()

export const validateConfirmationEmail = [
    body('email').notEmpty().isString().isEmail().custom(async email => {
        const user = await userQueryRepositoryInst.getUserByEmail(email)
        if (!user) {
            throw new Error('Wrong email')
        }
        if (user.confirmationEmail.isConfirmed === true) {
            throw new Error('User wit email: ' + user.email + ' is already confirmed')
        }
    })
]