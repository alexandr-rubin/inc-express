import { commentRepository } from "../repositories/commentRepository"
import { Result } from "../models/Result"

export const commentService = {
    async updateCommentByid(id: string, content: string, userId: string): Promise<Result<boolean>> {
        return await commentRepository.updateCommentById(id, content, userId)
    },
    async deleteCommentById(id: string, userId: string): Promise<Result<boolean>> {
        return await commentRepository.deleteCommentById(id, userId)
    }
}