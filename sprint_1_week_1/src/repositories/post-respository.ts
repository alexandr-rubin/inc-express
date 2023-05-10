import { Post } from '../models/Post'
import { blogRepository } from './blog-respository'
import { postsCollection } from './db'
import { ObjectId } from 'mongodb'

export const postRepository = {
    async getPosts(): Promise<Post[]> {
        return await postsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async addPost(post: Post): Promise<Post> {
        const blog = await blogRepository.getBlogById(post.blogId)
        if (!blog) {
            throw new Error(`Blog with id ${post.blogId} not found`)
        }

        const newPost: Post = {
            id: new ObjectId().toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const result = {...newPost}
        await postsCollection.insertOne(newPost)
        return result
    },
    async getPostById(id: string): Promise<Post | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: false}})
    },
    async updatePostByid(id: string, newPost: Post): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id}, newPost)
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