import mongoose from 'mongoose'
import { WithId } from 'mongodb'

// export type Comment ={
//     id: string,
//     content: string,
//     commentatorInfo: {
//         userId: string,
//         userLogin: string
//     },
//     createdAt: string,
//     postId: string
// }

export class CommentViewModel {
    constructor(public id: string, public content: string, public commentatorInfo: {userId: string, userLogin: string}, 
        public createdAt: string, public postId: string, public likesInfo: {likesCount: number, dislikesCount: number, myStatus: string}){}
}

export class Comment {
    constructor(public id: string, public content: string, public commentatorInfo: {userId: string, userLogin: string}, 
        public createdAt: string, public postId: string, public likesInfo: {likesCount: number, dislikesCount: number}){}
}

export const CommentSchema = new mongoose.Schema<WithId<Comment>>({
    id: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true }
    },
    createdAt: { type: String, require: true },
    postId: { type: String, require: true },
    likesInfo: { likesCount: { type: Number, require: true }, dislikesCount: { type: Number, require: true } }
}, { versionKey: false })
export const CommentModel =  mongoose.model('Comments', CommentSchema)