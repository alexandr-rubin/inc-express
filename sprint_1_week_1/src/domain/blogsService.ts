import { Blog } from '../models/Blog'
import { ObjectId } from 'mongodb'
import { BlogRepository } from '../repositories/blogRespository'
import { Post } from '../models/Post'
import { PostService } from './postsService'
import { BlogQueryRepository } from '../queryRepositories/blogQueryRepository'
import { injectable } from 'inversify'

@injectable()
export class BlogService {
    constructor(protected blogRepository: BlogRepository, protected blogQueryRepository: BlogQueryRepository, protected postService: PostService){}
    async addBlog(blog: Blog): Promise<Blog> {
        const newBlog: Blog = new Blog(new ObjectId().toString(), blog.name, blog.description, blog.websiteUrl, new Date().toISOString(), false)
        const result = {...newBlog}
        await this.blogRepository.addBlog(newBlog)
        return result
    }
    async updateBlogById(id: string, newBlog: Blog): Promise<boolean> {
        return await this.blogRepository.updateBlogById(id, newBlog)
    }
    async deleteBlogById(id: string): Promise<boolean> {
        return await this.blogRepository.deleteBlogById(id)
    }
    testingDeleteAllBlogs() {
        this.blogRepository.testingDeleteAllBlogs()
    }
    async addPostForSpecificBlog(blogId: string, post: Post): Promise<Post | null> {
        const isAdded = await this.blogQueryRepository.getBlogById(blogId) === null
        if(isAdded){
            return null
        }
        post.blogId = blogId
        //const result = {...post, blogId}
        return (await this.postService.addPost(post)).data
    }
}