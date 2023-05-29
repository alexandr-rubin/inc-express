import { body } from "express-validator"
import { userRepository } from "../repositories/userRepository"

export const validateEmail = [
    body('email').notEmpty().isString().isEmail().custom(async email => {
        const user = await userRepository.getUserByEmail(email)
        if (!user) {
            throw new Error('Wrong email')
        }
    }),
    body('email').notEmpty().isString().isEmail().custom(async email => {
        const user = await userRepository.getUserByEmail(email)
        if (user && user.confirmationEmail.isConfirmed) {
            throw new Error('User wit email: ' + user.email + ' is already registered')
        }
    })
]