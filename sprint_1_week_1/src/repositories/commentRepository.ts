import { commentsCollection } from './db'
import { Comment } from '../models/Comment'
import { Result } from '../models/Result'
import { ResultCode } from '../helpers/resultCode'

export const commentRepository = {
    async updateCommentById(id: string, content: string, userId: string): Promise<Result<boolean>> {
        const comment = await this.getCommentById(id)
        if(comment && comment.commentatorInfo.userId !== userId){
            return {
                code: ResultCode.Forbidden,
                data: null,
                errorMessage: "Forbidden"
            }
        }
        const result = await commentsCollection.updateOne({id: id}, { $set: {content: content}})

        if(result.matchedCount === 1){
            return {
                code: ResultCode.NoContent,
                data: true,
                errorMessage: "Updated"
            }
        }

        return {
            code: ResultCode.NotFound,
            data: false,
            errorMessage: "Not Found"
        }
    },
    async deleteCommentById(id: string, userId: string): Promise<Result<boolean>> {
        const comment = await this.getCommentById(id)
        if(comment && comment.commentatorInfo.userId !== userId){
            return {
                code: ResultCode.Forbidden,
                data: null,
                errorMessage: "Forbidden"
            }
        }
        const result = await commentsCollection.deleteOne({id: id})
        if(result.deletedCount === 1){
            return {
                code: ResultCode.NoContent,
                data: true,
                errorMessage: "Deleted"
            }
        }

        return {
            code: ResultCode.NotFound,
            data: false,
            errorMessage: "Not Found"
        }
    },
    async getCommentById(id: string): Promise<Comment | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: false, postId: false}})
    },
    testingDeleteAllComments() {
        commentsCollection.deleteMany({})
    },
}