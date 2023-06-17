import { Blog } from '../models/Blog'
//import { blogsCollection } from './db'
import { BlogModel } from '../models/Blog'

export const blogRepository = {
    async addBlog(blog: Blog): Promise<boolean> {
        // TODO: return
        try{
            await BlogModel.insertMany([blog])
            return true
        }
        catch(err){
            return false
        }
    },
    async updateBlogById(id: string, newBlog: Blog): Promise<boolean> {
        const result = await BlogModel.updateOne({id: id}, { $set: {name: newBlog.name, description: newBlog.description, websiteUrl: newBlog.websiteUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllBlogs() {
        await BlogModel.deleteMany({})
    }
}