import { Post } from '../models/Post'
// import { commentsCollection, postsCollection } from '../repositories/db'
import { CommentModel } from '../models/Comment'
import { PostModel } from '../models/Post'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
import { Comment } from '../models/Comment'
import { Request } from 'express'
import { Like, LikeModel } from '../models/Like'

export class PostQueryRepository {
    async getPosts(req: Request): Promise<Paginator<Post>> {
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await PostModel.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize).lean()
        const count = await PostModel.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
        const result = createPaginationResult(count, query, posts)
        
        return result
    }
    async getPostById(id: string): Promise<Post | null> {
        const post = await PostModel.findOne({id: id}, {projection: {_id: false}})
        return post
    }
    async getCommentsForSpecifiedPost(postId: string, req: Request, userId: string | null): Promise<Paginator<Comment> | null>{
        const isFinded = await this.getPostById(postId)
        if(isFinded === null){
            return null
        }
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const comments = await CommentModel.find({postId: postId}, {projection: {_id: false, postId: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip)
        .limit(query.pageSize).lean()
        //fix
        //const newArray = comments.map(comment => ({...comment, likesInfo:{...comment.likesInfo, myStatus: 'None' }}))
        const newArray = comments.map(({ _id, ...rest }) => ({
            ...rest,
            likesInfo: { ...rest.likesInfo, myStatus: 'None' }
        }))
        //fix
        for(let i = 0; i < newArray.length; i++){
            const status = await LikeModel.findOne({commentId: newArray[i].id, userId: userId})
            if(status){
                newArray[i].likesInfo.myStatus = status.likeStatus
            }
        }
        const count = await CommentModel.countDocuments({postId: postId})
        const result = createPaginationResult(count, query, newArray)
        return result
    }
}