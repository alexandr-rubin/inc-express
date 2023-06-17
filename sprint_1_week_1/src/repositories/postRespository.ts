import { Post } from '../models/Post'
import { PostModel } from '../models/Post'
import { CommentModel } from '../models/Comment'
import { ObjectId } from 'mongodb'
import { Comment } from '../models/Comment'
import { User } from '../models/User'
import { postQueryRepository } from '../queryRepositories/postQueryRepository'

export const postRepository = {
    async addPost(post: Post): Promise<boolean> {
        // TODO: return
        try{
            await PostModel.insertMany([post])
            return true
        }
        catch(err){
            return false
        }
    },
    async updatePostByid(id: string, newPost: Post): Promise<boolean> {
        const result = await PostModel.updateOne({id: id}, { $set: {title: newPost.title, shortDescription: newPost.shortDescription, content: newPost.content, blogId: newPost.blogId}})
        return result.matchedCount === 1
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllPosts() {
        await PostModel.deleteMany({})
    },
    async createComment(user: User, content: string, postId: string): Promise<Comment | null> {
        const post = await postQueryRepository.getPostById(postId)
        if(!post){
            return null
        }

        const comment: Comment = {
            id: new ObjectId().toString(),
            content: content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: postId
        }

        const result = {...comment}

        try{
            await CommentModel.insertMany([comment])
        }
        catch(err){
            return null
        }

        return result
    }
}