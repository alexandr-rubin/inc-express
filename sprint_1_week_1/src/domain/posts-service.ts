import { Post } from '../models/Post'
import { ObjectId } from 'mongodb'
import { blogService } from './blogs-service'
import { postRepository } from '../repositories/post-respository'

export const postService = {
    async getPosts(): Promise<Post[]> {
        return await postRepository.getPosts()
    },
    async addPost(post: Post): Promise<Post> {
        const blog = await blogService.getBlogById(post.blogId)
        if (!blog) {
            throw new Error(`Blog with id ${post.blogId} not found`)
        }

        const newPost: Post = {
            id: new ObjectId().toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const result = {...newPost}
        await postRepository.addPost(newPost)
        return result
    },
    async getPostById(id: string): Promise<Post | null> {
        return await postRepository.getPostById(id)
    },
    async updatePostByid(id: string, newPost: Post): Promise<boolean> {
        return await postRepository.updatePostByid(id, newPost)
    },
    async deletePostById(id: string): Promise<boolean> {
        return  await postRepository.deletePostById(id)
    },
    async testingDeleteAllPosts() {
        postRepository.testingDeleteAllPosts()
    }
}