import { Post } from '../models/Post'
import { blogRepository } from './blog-respository'
import { postsCollection } from './db'
import { ObjectId } from 'mongodb'

export const postRepository = {
    async getPosts(): Promise<Post[]> {
        return await postsCollection.find({}).toArray()
    },
    async addPost(post: Post): Promise<Post> {
        const blog = await blogRepository.getBlogById(new ObjectId(post.blogId))
        if (!blog) {
            throw new Error(`Blog with id ${post.blogId} not found`)
        }

        const newPost: Post = {
            id: (+new Date()).toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        await postsCollection.insertOne(newPost)
        return newPost
    },
    async getPostById(id: ObjectId): Promise<Post | null> {
        return await postsCollection.findOne({_id: id})
    },
    async updatePostByid(id: ObjectId, newPost: Post): Promise<boolean> {
        const result = await postsCollection.updateOne({_id: id}, newPost)
        return result.matchedCount === 1
    },
    async deletePostById(id: ObjectId): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllPosts() {
        postsCollection.deleteMany({})
    }
}