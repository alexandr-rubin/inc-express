import { Blog } from '../models/Blog'
import { ObjectId } from 'mongodb'
import { blogRepository } from '../repositories/blogRespository'
import { Post } from '../models/Post'
import { postService } from './postsService'
import { blogQueryRepository } from '../queryRepositories/blogQueryRepository'

export const blogService = {
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
    async updateBlogById(id: string, newBlog: Blog): Promise<boolean> {
        return await blogRepository.updateBlogById(id, newBlog)
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return await blogRepository.deleteBlogById(id)
    },
    testingDeleteAllBlogs() {
        blogRepository.testingDeleteAllBlogs()
    },
    async addPostForSpecificBlog(blogId: string, post: Post): Promise<Post | null> {
        const isAdded = await blogQueryRepository.getBlogById(blogId) === null
        if(isAdded){
            return null
        }
        post.blogId = blogId
        //const result = {...post, blogId}
        return (await postService.addPost(post)).data
    }
}