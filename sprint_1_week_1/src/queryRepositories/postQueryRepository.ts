import { Post } from '../models/Post'
// import { commentsCollection, postsCollection } from '../repositories/db'
import { CommentModel, CommentViewModel } from '../models/Comment'
import { PostModel } from '../models/Post'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
import { Comment } from '../models/Comment'
import { Request } from 'express'
import { Like, LikeModel } from '../models/Like'
import { LikeStatuses } from '../helpers/likeStatus'
import { WithId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
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
    async getCommentsForSpecifiedPost(postId: string, req: Request, userId: string): Promise<Paginator<CommentViewModel> | null>{
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
        const count = await CommentModel.countDocuments({postId: postId})
        const result = createPaginationResult(count, query, comments)

        return this.editCommentToViewModel(result, userId)
    }

    private async editCommentToViewModel(comment: Paginator<WithId<Comment>>, userId: string): Promise<Paginator<CommentViewModel>>  {
        const newArray = {...comment, items: comment.items.map(({ _id, postId, ...rest }) => ({
            ...rest,
            likesInfo: { ...rest.likesInfo, myStatus: LikeStatuses.None.toString() }
        }))}
        for(let i = 0; i < newArray.items.length; i++){
            const status = await LikeModel.findOne({commentId: newArray.items[i].id, userId: userId})
            if(status){
                newArray.items[i].likesInfo.myStatus = status.likeStatus
            }
        }
        return newArray
    }
}