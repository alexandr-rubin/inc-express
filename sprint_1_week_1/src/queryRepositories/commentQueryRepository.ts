import { commentsCollection } from '../repositories/db'
import { Comment } from '../models/Comment'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
import { Request } from 'express'

export const commentQueryRepository = {
    async getCommentById(id: string): Promise<Comment | null> {
        const comment = await commentsCollection.findOne({id: id}, {projection: {_id: false, postId: false}})
        return comment
    },
    async getAllComments(){
        return await commentsCollection.find({})
    }
}