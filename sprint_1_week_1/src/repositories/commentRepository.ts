import { commentsCollection } from './db'
import { Comment } from '../models/Comment'

export const commentRepository = {
    async updateCommentById(id: string, content: string, userId: string): Promise<boolean | null> {
        const comment = await this.getCommentById(id)
        if(comment && comment.commentatorInfo.userId !== userId){
            return null
        }
        const result = await commentsCollection.updateOne({id: id}, { $set: {content: content}})

        return  result.matchedCount === 1
    },
    async deleteCommentById(id: string, userId: string): Promise<boolean | null> {
        const comment = await this.getCommentById(id)
        if(comment && comment.commentatorInfo.userId !== userId){
            return null
        }
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getCommentById(id: string): Promise<Comment | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: false, postId: false}})
    },
    testingDeleteAllComments() {
        commentsCollection.deleteMany({})
    },
}