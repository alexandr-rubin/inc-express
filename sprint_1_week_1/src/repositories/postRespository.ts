import { Post } from '../models/Post'
import { PostModel } from '../models/Post'
import { CommentModel } from '../models/Comment'
import { ObjectId } from 'mongodb'
import { Comment } from '../models/Comment'
import { User } from '../models/User'
import { PostQueryRepository } from '../queryRepositories/postQueryRepository'
import { injectable } from 'inversify'

@injectable()
export class PostRepository {
    private postQueryRepository: PostQueryRepository
    constructor(){
        this.postQueryRepository = new PostQueryRepository()
    }
    async addPost(post: Post): Promise<boolean> {
        // TODO: return
        try{
            await PostModel.insertMany([post])
            return true
        }
        catch(err){
            return false
        }
    }
    async updatePostByid(id: string, newPost: Post): Promise<boolean> {
        const post = await PostModel.updateOne({...newPost, id: id})
        return post.acknowledged
    }
    async deletePostById(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({id: id})
        return result.deletedCount === 1
    }
    async testingDeleteAllPosts() {
        await PostModel.deleteMany({})
    }
    async createComment(comment: Comment): Promise<Comment | null> {
        const post = await this.postQueryRepository.getPostById(comment.postId)
        if(!post){
            return null
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