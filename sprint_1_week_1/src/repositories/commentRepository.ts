//import { commentsCollection } from './db'
import { Comment, CommentModel, CommentViewModel } from '../models/Comment'
import { Result } from '../models/Result'
import { ResultCode } from '../helpers/resultCode'
import { CommentQueryRepository } from '../queryRepositories/commentQueryRepository'
import { CommentLike, CommentLikeModel } from '../models/Like'
import { ObjectId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
export class CommentRepository {
    constructor(protected commentQueryRepository: CommentQueryRepository){}
    async updateCommentById(id: string, content: string, userId: string): Promise<Result<boolean>> {
        const comment = await this.commentQueryRepository.getCommentById(id, userId)
        if(comment && comment.commentatorInfo.userId !== userId){
            return {
                code: ResultCode.Forbidden,
                data: null,
                errorMessage: "Forbidden"
            }
        }
        const result = await CommentModel.updateOne({id: id}, {content})

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
    }
    async deleteCommentById(id: string, userId: string): Promise<Result<boolean>> {
        const comment = await this.commentQueryRepository.getCommentById(id, userId)
        if(comment && comment.commentatorInfo.userId !== userId){
            return {
                code: ResultCode.Forbidden,
                data: null,
                errorMessage: "Forbidden"
            }
        }
        const result = await CommentModel.deleteOne({id: id})
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
    }
    async updateCommentLikeStatus(commentId: string, likeStatus: string, userId:string): Promise<boolean> {
        const comment = await CommentModel.findOne({id: commentId})
        if(!comment){
            return false
        }
        const like = await CommentLikeModel.findOne({commentId: commentId, userId: userId})
        if(!like){
            const newLike = new CommentLikeModel({id: new ObjectId().toString(), commentId: commentId, userId: userId, likeStatus: likeStatus})
            await newLike.save()
            if(likeStatus === 'Like'){
                comment.likesInfo.likesCount +=1
            }
            else{
                comment.likesInfo.dislikesCount +=1
            }
            await comment.save()
            
            return true
        }
        if(like.likeStatus === likeStatus){
            return true
        }
        if(likeStatus === 'None'){
            if(like.likeStatus === 'Like'){
                comment.likesInfo.likesCount -= 1
            }
            else{
                comment.likesInfo.dislikesCount -= 1
            }
            like.likeStatus = likeStatus
            await like.save()
            await comment.save()
            return true
        }
        if(like.likeStatus !== likeStatus){
            like.likeStatus = likeStatus
            await like.save()
            if(likeStatus === 'Like'){
                comment.likesInfo.likesCount += 1
                comment.likesInfo.dislikesCount -= 1
            }
            else{
                comment.likesInfo.likesCount -= 1
                comment.likesInfo.dislikesCount += 1
            }
            await comment.save()
            return true
        }
        return true
    }
    // async createCommentLikeOrDislike(newLike: Like, comment: Comment): Promise<boolean> {
    //     const isCreated = await LikeModel.create(newLike)
    //         if(newLike.likeStatus === 'Like'){
    //             const isUpdated = await CommentModel.updateOne({id: newLike.commentId}, {$set: {'likesInfo.likesCount': comment.likesInfo.likesCount + 1}})
    //         }
    //         if(newLike.likeStatus === 'Dislike'){
    //             const isUpdated = await CommentModel.updateOne({id: newLike.commentId}, {$set: {'likesInfo.dislikesCount': comment.likesInfo.dislikesCount + 1}})
    //         }
    //         // fix update validation and create validation
    //         return true
    // }
    async testingDeleteAllComments() {
        await CommentModel.deleteMany({})
    }
}