import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export class Like {
    constructor(public id: string, public commentId: string, public userId: string, public likeStatus: string){}
}

export const LikeSchema = new mongoose.Schema<WithId<Like>>({
    id: { type: String, require: true },
    commentId: { type: String, require: true },
    userId: { type: String, require: true },
    likeStatus: { type: String, require: true }
})
export const LikeModel =  mongoose.model('Likes', LikeSchema)