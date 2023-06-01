import { Blog } from '../models/Blog'
import { blogsCollection } from './db'

export const blogRepository = {
    async addBlog(blog: Blog): Promise<boolean> {
        // TODO: return
        const isAdded = (await blogsCollection.insertOne(blog)).acknowledged === true
        return isAdded
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