import { Post } from '../models/Post'
import { blogRepository } from './blog-respository'
import { postsCollection } from './db'
import { ObjectId } from 'mongodb'

export const postRepository = {
    async getPosts(): Promise<Post[]> {
        return await postsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async addPost(post: Post): Promise<boolean> {
        // TODO: return
        return (await postsCollection.insertOne(post)).acknowledged === true
    },
    async getPostById(id: string): Promise<Post | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: false}})
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
    }
}