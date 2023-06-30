//import { commentsCollection } from '../repositories/db'
import { LikeStatuses } from '../helpers/likeStatus'
import { CommentModel, CommentViewModel } from '../models/Comment'
import { Comment } from '../models/Comment'
import { LikeModel } from '../models/Like'


export class CommentQueryRepository {
    async getCommentById(id: string, userId: string) {
        //fix typization
        const like = await LikeModel.findOne({commentId: id , userId: userId}).lean()
        const likeStatus = like === null ? LikeStatuses.None : like.likeStatus
        const comment = await CommentModel.findOne({id: id}, {projection: {_id: false, postId: false}}).lean()
        if(comment){
            const result = {...comment, likesInfo: {...comment.likesInfo, myStatus: likeStatus}}  
            const { _id, postId, ...newResult}   = result
            return newResult
        }
        
        return null
    }
    async getAllComments(){
        const comments = await CommentModel.find({}).lean()
        return comments
    }
}