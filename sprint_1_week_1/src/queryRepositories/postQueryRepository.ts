import { Post, PostViewModel } from '../models/Post'
// import { commentsCollection, postsCollection } from '../repositories/db'
import { CommentModel, CommentViewModel } from '../models/Comment'
import { PostModel } from '../models/Post'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
import { Comment } from '../models/Comment'
import { Request } from 'express'
import { CommentLike, CommentLikeModel, PostLikeModel } from '../models/Like'
import { LikeStatuses } from '../helpers/likeStatus'
import { WithId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
export class PostQueryRepository {
    async getPosts(req: Request, userId: string): Promise<Paginator<Post>> {
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await PostModel.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}).select('-_id')
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize).lean()
        const count = await PostModel.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
        const result = createPaginationResult(count, query, posts)

        return await this.editPostToViewModel(result, userId)
    }
    async getPostById(postId: string, userId: string): Promise<Post | null> {
        const like = await PostLikeModel.findOne({postId: postId , userId: userId}).lean()
        const likeStatus = like === null ? LikeStatuses.None : like.likeStatus
        const post = await PostModel.findOne({id: postId}).select('-_id').lean()
        if(post){
            const newestLikes = await PostLikeModel.find({postId: postId, likeStatus: LikeStatuses.Like}).sort({ date: -1, login: -1 }).select('-_id -__v -id -postId -likeStatus').limit(3).lean()
            const result: PostViewModel = {...post, extendedLikesInfo: {...post.extendedLikesInfo, myStatus: likeStatus,
                newestLikes: newestLikes }}
            console.log(newestLikes)
            // мб не над удалять _id здесь. удалено выше
            return result
        }
        return null
    }
    async getCommentsForSpecifiedPost(postId: string, req: Request, userId: string): Promise<Paginator<CommentViewModel> | null>{
        const isFinded = await this.getPostById(postId, userId)
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

        return await this.editCommentToViewModel(result, userId)
    }

    private async editCommentToViewModel(comment: Paginator<WithId<Comment>>, userId: string): Promise<Paginator<CommentViewModel>>  {
        const newArray = {...comment, items: comment.items.map(({ _id, postId, ...rest }) => ({
            ...rest,
            likesInfo: { ...rest.likesInfo, myStatus: LikeStatuses.None.toString() }
        }))}
        for(let i = 0; i < newArray.items.length; i++){
            const status = await CommentLikeModel.findOne({commentId: newArray.items[i].id, userId: userId})
            if(status){
                newArray.items[i].likesInfo.myStatus = status.likeStatus
            }
        }
        return newArray
    }

    public async editPostToViewModel(post: Paginator<WithId<Post>>, userId: string): Promise<Paginator<PostViewModel>>  {
        const newArray: Paginator<PostViewModel> = {...post, items: post.items.map(({...rest }) => ({
            ...rest,
            extendedLikesInfo: { ...rest.extendedLikesInfo, myStatus: LikeStatuses.None.toString(), newestLikes: [] }
        }))}
        for(let i = 0; i < newArray.items.length; i++){
            const newestLikes = await PostLikeModel.find({postId: newArray.items[i].id, likeStatus: LikeStatuses.Like}).sort({ addedAt: -1 }).select('-_id -__v -id -postId -likeStatus').limit(3).lean()
            if(newestLikes){
                newArray.items[i].extendedLikesInfo.newestLikes = newestLikes
            }
            const status = await PostLikeModel.findOne({postId: newArray.items[i].id, userId: userId})
            if(status){
                newArray.items[i].extendedLikesInfo.myStatus = status.likeStatus
            }
        }
        return newArray 
    }
}