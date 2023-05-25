import { Post } from '../models/Post'
import { ObjectId } from 'mongodb'
import { blogService } from './blogsService'
import { postRepository } from '../repositories/postRespository'
import { Request } from "express"
import { Paginator } from '../models/Paginator'
import { createPaginationQuery } from '../helpers/pagination'
import { Comment } from '../models/Comment'
import { User } from '../models/User'
import { Result } from '../models/Result'
import { ResultCode } from '../helpers/resultCode'

export const postService = {
    async getPosts(req: Request): Promise<Paginator<Post>> {
        const postQuery = createPaginationQuery(req)
        return await postRepository.getPosts(postQuery)
    },
    async addPost(post: Post): Promise<Result<Post>> {
        const blog = await blogService.getBlogById(post.blogId)

        if (!blog) {
            return {
                code: ResultCode.NotFound,
                data: null,
                errorMessage: 'incorrect id'
            }
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
        return {
            code: ResultCode.Success,
            data: result,
            errorMessage: 'OK'
        }
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
    },
    async createComment(user: User, content: string, postId: string): Promise<Comment | null> {
        return await postRepository.createComment(user, content, postId)
    },
    async getCommentsForSpecifiedPost(postId: string, req: Request): Promise<Paginator<Comment> | null> {
        if(await postRepository.getPostById(postId) === null){
            return null
        }
        const postQuery = createPaginationQuery(req)
        return await postRepository.getCommentsForSpecifiedPost(postId, postQuery)
    },
}