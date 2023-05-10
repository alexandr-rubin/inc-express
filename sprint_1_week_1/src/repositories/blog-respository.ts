import { Blog } from '../models/Blog'
import { blogsCollection } from './db'
import { ObjectId } from 'mongodb'

export const blogRepository = {
    async getBlogs(): Promise<Blog[]> {
        return await blogsCollection.find({}).toArray()
    },
    async addBlog(blog: Blog): Promise<Blog> {
        const newBlog: Blog = {
            id: (+new Date()).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    async getBlogById(id: ObjectId): Promise<Blog | null> {
        return await blogsCollection.findOne({_id: id})
    },
    async updateBlogById(id: ObjectId, newBlog: Blog): Promise<boolean> {
        const result = await blogsCollection.updateOne({_id: id}, { $set: {newBlog}})
        return result.matchedCount === 1
    },
    async deleteBlogById(id: ObjectId): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: id})
        return result.deletedCount === 1
    },
    testingDeleteAllBlogs() {
        blogsCollection.deleteMany({})
    }
}