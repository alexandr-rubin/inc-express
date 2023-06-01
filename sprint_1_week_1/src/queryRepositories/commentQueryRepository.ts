import { commentsCollection } from '../repositories/db'
import { Comment } from '../models/Comment'

export const commentQueryRepository = {
    async getCommentById(id: string): Promise<Comment | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: false, postId: false}})
    }
}