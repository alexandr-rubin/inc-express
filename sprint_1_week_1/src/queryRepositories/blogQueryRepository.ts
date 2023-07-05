import { Blog } from '../models/Blog'
//import { blogsCollection } from '../repositories/db'
import { BlogModel } from '../models/Blog'
import { Paginator } from '../models/Paginator'
import { createPaginationQuery, createPaginationResult } from '../helpers/pagination'
//import { postsCollection } from '../repositories/db'
import { PostModel } from '../models/Post'
import { Post } from '../models/Post'
import { Request } from 'express'
import { injectable } from 'inversify'
import { PostQueryRepository } from './postQueryRepository'

@injectable()
export class BlogQueryRepository {
    constructor(protected postQueryRepository: PostQueryRepository){}
    async getBlogs(req: Request): Promise<Paginator<Blog>> {
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const blogs = await BlogModel.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize).lean()
        const count = await BlogModel.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
        const result = createPaginationResult(count, query, blogs)
        
        return result
    }
    async getBlogById(id: string): Promise<Blog | null> {
        const blog = await BlogModel.findOne({id: id}, {projection: {_id: false}})
        return blog
    }
    async getPostsForSpecifiedBlog(blogId: string, req: Request, userId: string): Promise<Paginator<Post> | null>{
        const isFinded = await this.getBlogById(blogId) === null
        if(isFinded){
            return null
        }
        const query = createPaginationQuery(req)
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await PostModel.find(query.searchNameTerm === null ? {blogId: blogId} : {blogId: blogId, name: {$regex: query.searchNameTerm, $options: 'i'}}).select('-_id')
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip)
        .limit(query.pageSize).lean()
        const count = await PostModel.countDocuments({blogId: blogId})
        const result = createPaginationResult(count, query, posts)
        return await this.postQueryRepository.editPostToViewModel(result, userId)
    }
}