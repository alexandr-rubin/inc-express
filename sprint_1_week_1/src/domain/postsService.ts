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
import { blogQueryRepository } from '../queryRepositories/blogQueryRepository'

export const postService = {
    async addPost(post: Post): Promise<Result<Post>> {
        const blog = await blogQueryRepository.getBlogById(post.blogId)

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
        const comment: Comment = {
            id: new ObjectId().toString(),
            content: content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: postId
        }
        return await postRepository.createComment(comment)
    }
}