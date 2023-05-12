import { Blog } from '../models/Blog'
import { blogsCollection } from './db'
import { ObjectId } from 'mongodb'

export const blogRepository = {
    async getBlogs(): Promise<Blog[]> {
        return await blogsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async addBlog(blog: Blog): Promise<boolean> {
        // TODO: return
        return (await blogsCollection.insertOne(blog)).acknowledged === true
    },
    async getBlogById(id: string): Promise<Blog | null> {
        return await blogsCollection.findOne({id: id}, {projection: {_id: false}})
    },
    async updateBlogById(id: string, newBlog: Blog): Promise<boolean> {
        const result = await blogsCollection.updateOne({id: id}, { $set: {name: newBlog.name, description: newBlog.description, websiteUrl: newBlog.websiteUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    testingDeleteAllBlogs() {
        blogsCollection.deleteMany({})
    }
}