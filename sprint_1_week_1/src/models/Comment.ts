import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type Comment ={
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    postId: string
}

export const CommentSchema = new mongoose.Schema<WithId<Comment>>({
    id: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true }
    },
    createdAt: { type: String, require: true },
    postId: { type: String, require: true }
})
export const CommentModel =  mongoose.model('Comments', CommentSchema)