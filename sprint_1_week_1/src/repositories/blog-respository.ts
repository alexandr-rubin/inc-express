import { Blog } from '../models/Blog'
import { blogsCollection } from './db'
import { Paginator } from '../models/Paginator'
import { PaginationQuery } from '../models/PaginationQuery'
import { createPaginationResult } from '../helpers/pagination'
import { postsCollection } from './db'

export const blogRepository = {
    async getBlogs(query: PaginationQuery): Promise<Paginator> {
        const skip = (query.pageNumber - 1) * query.pageSize
        const blogs = await blogsCollection.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize)
        .toArray()
        const count = blogs.length
        const result = createPaginationResult(count, query, blogs)
        
        return result
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
    },
    async getPostsForSpecifiedBlog(blogId: string, query: PaginationQuery): Promise<Paginator>{
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await postsCollection.find(query.searchNameTerm === null ? {blogId: blogId} : {blogId: blogId, name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize)
        .toArray()
        const count = await postsCollection.countDocuments({blogId: blogId})
        const result = createPaginationResult(count, query, posts)
        return result
    }
}