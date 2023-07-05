import { Post } from '../models/Post'
import { PostModel } from '../models/Post'
import { CommentModel } from '../models/Comment'
import { ObjectId } from 'mongodb'
import { Comment } from '../models/Comment'
import { User } from '../models/User'
import { PostQueryRepository } from '../queryRepositories/postQueryRepository'
import { injectable } from 'inversify'
import { PostLikeModel } from '../models/Like'
import { post } from '@typegoose/typegoose'

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
        //fix
        const post = await this.postQueryRepository.getPostById(comment.postId, '')
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
    async updatePostLikeStatus(postId: string, likeStatus: string, userId:string, login: string): Promise<boolean> {
        const post = await PostModel.findOne({id: postId})
        if(!post){
            return false
        }
        const like = await PostLikeModel.findOne({postId: postId, userId: userId})
        if(!like){
            const newLike = new PostLikeModel({id: new ObjectId().toString(), postId: postId, userId: userId, login: login, addedAt: new Date().toISOString(), likeStatus: likeStatus})
            await newLike.save()
            if(likeStatus === 'Like'){
                post.extendedLikesInfo.likesCount +=1
            }
            else{
                post.extendedLikesInfo.dislikesCount +=1
            }
            await post.save()
            
            return true
        }
        if(like.likeStatus === likeStatus){
            return true
        }
        if(likeStatus === 'None'){
            if(like.likeStatus === 'Like'){
                post.extendedLikesInfo.likesCount -= 1
            }
            else{
                post.extendedLikesInfo.dislikesCount -= 1
            }
            like.likeStatus = likeStatus
            await like.save()
            await post.save()
            return true
        }
        if(like.likeStatus !== likeStatus){
            like.likeStatus = likeStatus
            await like.save()
            if(likeStatus === 'Like'){
                post.extendedLikesInfo.likesCount += 1
                post.extendedLikesInfo.dislikesCount -= 1
            }
            else{
                post.extendedLikesInfo.likesCount -= 1
                post.extendedLikesInfo.dislikesCount += 1
            }
            await post.save()
            return true
        }
        return true
    }
}