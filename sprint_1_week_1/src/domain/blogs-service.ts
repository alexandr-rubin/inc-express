import { Blog } from '../models/Blog'
import { ObjectId } from 'mongodb'
import { blogRepository } from '../repositories/blog-respository'

export const blogService = {
    async getBlogs(): Promise<Blog[]> {
        return await blogRepository.getBlogs()
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
    }
}