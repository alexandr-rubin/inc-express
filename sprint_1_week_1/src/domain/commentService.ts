import { CommentRepository } from "../repositories/commentRepository"
import { Result } from "../models/Result"
import { Like, LikeModel, LikeSchema } from "../models/Like"
import { ObjectId } from "mongodb"
import { injectable } from "inversify"

@injectable()
export class CommentService {
    constructor(protected commentRepository: CommentRepository){}
    async updateCommentByid(id: string, content: string, userId: string): Promise<Result<boolean>> {
        return await this.commentRepository.updateCommentById(id, content, userId)
    }
    async deleteCommentById(id: string, userId: string): Promise<Result<boolean>> {
        return await this.commentRepository.deleteCommentById(id, userId)
    }
    async updateCommentLikeStatus(commentId: string, likeStatus: string, userId:string): Promise<boolean> {
        return await this.commentRepository.updateCommentLikeStatus(commentId, likeStatus, userId)
    }
}