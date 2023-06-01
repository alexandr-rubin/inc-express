import { Post } from '../models/Post'
import { commentsCollection, postsCollection } from '../repositories/db'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
import { Comment } from '../models/Comment'
import { Request } from 'express'

export const postQueryRepository = {
    async getPosts(req: Request): Promise<Paginator<Post>> {
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await postsCollection.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize)
        .toArray()
        const count = await postsCollection.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
        const result = createPaginationResult(count, query, posts)
        
        return result
    },
    async getPostById(id: string): Promise<Post | null> {
        const post = await postsCollection.findOne({id: id}, {projection: {_id: false}})
        return post
    },
    async getCommentsForSpecifiedPost(postId: string, req: Request): Promise<Paginator<Comment> | null>{
        const isFinded = await this.getPostById(postId) === null
        if(isFinded){
            return null
        }
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const comments = await commentsCollection.find({postId: postId}, {projection: {_id: false, postId: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip)
        .limit(query.pageSize)
        .toArray()
        const count = await commentsCollection.countDocuments({postId: postId})
        const result = createPaginationResult(count, query, comments)
        return result
    }
}