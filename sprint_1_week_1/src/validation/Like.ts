import { body } from "express-validator"

export const validateLike = [
    body('likeStatus').notEmpty().isString().trim().custom(async likeStatus => {
        if (likeStatus !== 'Like' && likeStatus !== 'Dislike' && likeStatus !== 'None') {
            throw new Error('Invalid like status')
        }
    })
]