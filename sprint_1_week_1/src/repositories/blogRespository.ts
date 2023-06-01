import { Blog } from '../models/Blog'
import { blogsCollection } from './db'
import { Paginator } from '../models/Paginator'
import { PaginationQuery } from '../models/PaginationQuery'
import { createPaginationResult } from '../helpers/pagination'
import { postsCollection } from './db'
import { Post } from '../models/Post'

export const blogRepository = {
    async addBlog(blog: Blog): Promise<boolean> {
        // TODO: return
        return (await blogsCollection.insertOne(blog)).acknowledged === true
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