import { Login } from "../models/Login"
import { User } from "../models/User"
import { commentRepository } from "../repositories/commentRepository"
import { authorizationRepository } from "../repositories/authorizationRepository"
import { Comment } from '../models/Comment'
import { Result } from "../models/Result"

export const commentService = {
    async updateCommentByid(id: string, content: string, userId: string): Promise<Result<boolean>> {
        return await commentRepository.updateCommentById(id, content, userId)
    },
    async deleteCommentById(id: string, userId: string): Promise<Result<boolean>> {
        return await commentRepository.deleteCommentById(id, userId)
    }
}