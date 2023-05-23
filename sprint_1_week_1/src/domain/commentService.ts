import { Login } from "../models/Login"
import { User } from "../models/User"
import { commentRepository } from "../repositories/commentRepository"
import { loginRepository } from "../repositories/loginRepository"
import { Comment } from '../models/Comment'

export const commentService = {
    async updateCommentByid(id: string, content: string, userId: string): Promise<boolean | null> {
        return await commentRepository.updateCommentById(id, content, userId)
    },
    async deleteCommentById(id: string, userId: string): Promise<boolean | null> {
        return await commentRepository.deleteCommentById(id, userId)
    },
    async getCommentById(id: string): Promise<Comment | null> {
        return await commentRepository.getCommentById(id)
    },
}