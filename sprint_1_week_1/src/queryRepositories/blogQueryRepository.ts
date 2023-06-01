import { Blog } from '../models/Blog'
import { blogsCollection } from '../repositories/db'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
import { postsCollection } from '../repositories/db'
import { Post } from '../models/Post'
import { Request } from 'express'

export const blogQueryRepository = {
    async getBlogs(req: Request): Promise<Paginator<Blog>> {
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const blogs = await blogsCollection.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize)
        .toArray()
        const count = await blogsCollection.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
        const result = createPaginationResult(count, query, blogs)
        
        return result
    },
    async getBlogById(id: string): Promise<Blog | null> {
        const blog = await blogsCollection.findOne({id: id}, {projection: {_id: false}})
        return blog
    },
    async getPostsForSpecifiedBlog(blogId: string, req: Request): Promise<Paginator<Post> | null>{
        const isFinded = await this.getBlogById(blogId) === null
        if(isFinded){
            return null
        }
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await postsCollection.find(query.searchNameTerm === null ? {blogId: blogId} : {blogId: blogId, name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip)
        .limit(query.pageSize)
        .toArray()
        const count = await postsCollection.countDocuments({blogId: blogId})
        const result = createPaginationResult(count, query, posts)
        return result
    }
}