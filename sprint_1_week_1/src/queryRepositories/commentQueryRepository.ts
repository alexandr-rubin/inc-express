import { commentsCollection } from '../repositories/db'
import { Comment } from '../models/Comment'

export const commentQueryRepository = {
    async getCommentById(id: string): Promise<Comment | null> {
        const comment = await commentsCollection.findOne({id: id}, {projection: {_id: false, postId: false}})
        return comment
    },
    async getAllComments(){
        const comments = await commentsCollection.find({}).toArray()
        return comments
    }
}