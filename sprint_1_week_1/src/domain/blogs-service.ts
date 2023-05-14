import { Blog } from '../models/Blog'
import { ObjectId } from 'mongodb'
import { blogRepository } from '../repositories/blog-respository'
import { Paginator } from '../models/Paginator'
import { Request } from "express"
import { createPaginationQuery } from '../helpers/pagination'
import { Post } from '../models/Post'
import { postService } from './posts-service'

export const blogService = {
    async getBlogs(req: Request): Promise<Paginator> {
        const blogQuery = createPaginationQuery(req)
        return await blogRepository.getBlogs(blogQuery)
    },
    async addBlog(blog: Blog): Promise<Blog> {
        const newBlog: Blog = {
            id: new ObjectId().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result = {...newBlog}
        await blogRepository.addBlog(newBlog)
        return result
    },
    async getBlogById(id: string): Promise<Blog | null> {
        return await blogRepository.getBlogById(id)
    },
    async updateBlogById(id: string, newBlog: Blog): Promise<boolean> {
        return await blogRepository.updateBlogById(id, newBlog)
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return await blogRepository.deleteBlogById(id)
    },
    testingDeleteAllBlogs() {
        blogRepository.testingDeleteAllBlogs()
    },
    async getPostsForSpecifiedBlog(blogId: string, req: Request): Promise<Paginator | null>{
        const postQuery = createPaginationQuery(req)
        if(await blogRepository.getBlogById(blogId) === null){
            return null
        }
        return await blogRepository.getPostsForSpecifiedBlog(blogId, postQuery)
    },
    async addPostForSpecificBlog(blogId: string, post: Post): Promise<Post | null> {
        if(await blogRepository.getBlogById(blogId) === null){
            return null
        }
        post.blogId = blogId
        return postService.addPost(post)
    }
}