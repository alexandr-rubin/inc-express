//import { commentsCollection } from '../repositories/db'
import { CommentModel } from '../models/Comment'
import { Comment } from '../models/Comment'

export const commentQueryRepository = {
    async getCommentById(id: string): Promise<Comment | null> {
        const comment = await CommentModel.findOne({id: id}, {projection: {_id: false, postId: false}})
        return comment
    },
    async getAllComments(){
        const comments = await CommentModel.find({}).lean()
        return comments
    }
}