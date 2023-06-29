import { body } from "express-validator"
import { UserQueryRepository } from "../queryRepositories/userQuertyRepository"

const userQueryRepositoryInst = new UserQueryRepository()

export const validateUser = [
    body('login').notEmpty().isString().trim().isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$').custom(async login => {
        const user = await userQueryRepositoryInst.getUserBylogin(login)
        if (user) {
            throw new Error('User wit login: ' + user.login + ' is already registered')
        }
    }),
    body('password').notEmpty().isString().trim().isLength({min: 6, max: 20}),
    body('email').notEmpty().isString().isEmail().custom(async email => {
        const user = await userQueryRepositoryInst.getUserByEmail(email)
        if (user) {
            throw new Error('User wit email: ' + user.email + ' is already registered')
        }
    })/*('/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/')*/
]