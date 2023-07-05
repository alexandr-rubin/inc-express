import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export class CommentLike {
    constructor(public id: string, public commentId: string, public userId: string, public likeStatus: string){}
}

export const CommentLikeSchema = new mongoose.Schema<WithId<CommentLike>>({
    id: { type: String, require: true },
    commentId: { type: String, require: true },
    userId: { type: String, require: true },
    likeStatus: { type: String, require: true }
})
export const CommentLikeModel =  mongoose.model('CommentLikes', CommentLikeSchema)
///////
export class PosttLike {
    constructor(public id: string, public postId: string, public userId: string, public login: string, public addedAt: string, public likeStatus: string){}
}
export const PostLikeSchema = new mongoose.Schema<WithId<PosttLike>>({
    id: { type: String, require: true },
    postId: { type: String, require: true },
    userId: { type: String, require: true },
    login: { type: String, require: true },
    addedAt: { type: String, require: true },
    likeStatus: { type: String, require: true }
})
export const PostLikeModel =  mongoose.model('PostLikes', PostLikeSchema)