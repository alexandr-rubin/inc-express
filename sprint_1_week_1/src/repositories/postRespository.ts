import { Post } from '../models/Post'
import { commentsCollection, postsCollection, usersCollection } from './db'
import { ObjectId } from 'mongodb'
import { Comment } from '../models/Comment'
import { User } from '../models/User'
import { postQueryRepository } from '../queryRepositories/postQueryRepository'

export const postRepository = {
    async addPost(post: Post): Promise<boolean> {
        // TODO: return
        const isAdded = (await postsCollection.insertOne(post)).acknowledged === true
        return isAdded
    },
    async updatePostByid(id: string, newPost: Post): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id}, { $set: {title: newPost.title, shortDescription: newPost.shortDescription, content: newPost.content, blogId: newPost.blogId}})
        return result.matchedCount === 1
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllPosts() {
        postsCollection.deleteMany({})
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

        const isAdded = await commentsCollection.insertOne(comment)
        if(isAdded.acknowledged === false){
            return null
        }

        return result
    }
}