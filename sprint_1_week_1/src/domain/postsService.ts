import { Post } from '../models/Post'
import { ObjectId } from 'mongodb'
import { BlogService } from './blogsService'
import { PostRepository } from '../repositories/postRespository'
import { Request } from "express"
import { Paginator } from '../models/Paginator'
import { createPaginationQuery } from '../helpers/pagination'
import { Comment, CommentViewModel } from '../models/Comment'
import { User } from '../models/User'
import { Result } from '../models/Result'
import { ResultCode } from '../helpers/resultCode'
import { BlogQueryRepository } from '../queryRepositories/blogQueryRepository'

export class PostService {
    constructor(protected blogQueryRepository: BlogQueryRepository, protected postRepository: PostRepository){}
    async addPost(post: Post): Promise<Result<Post>> {
        const blog = await this.blogQueryRepository.getBlogById(post.blogId)

        if (!blog) {
            return {
                code: ResultCode.NotFound,
                data: null,
                errorMessage: 'incorrect id'
            }
        }

        const newPost: Post = new Post(new ObjectId().toString(), post.title, post.shortDescription, post.content, blog.id, blog.name, new Date().toISOString())
        const result = {...newPost}
        await this.postRepository.addPost(newPost)
        return {
            code: ResultCode.Success,
            data: result,
            errorMessage: 'OK'
        }
    }
    async updatePostByid(id: string, newPost: Post): Promise<boolean> {
        return await this.postRepository.updatePostByid(id, newPost)
    }
    async deletePostById(id: string): Promise<boolean> {
        return  await this.postRepository.deletePostById(id)
    }
    async testingDeleteAllPosts() {
        this.postRepository.testingDeleteAllPosts()
    }
    async createComment(user: User, content: string, postId: string): Promise<CommentViewModel | null> {
        const comment: Comment = new Comment(new ObjectId().toString(), content, {userId: user.id, userLogin: user.login}, new Date().toISOString(), postId,
        {likesCount: 0, dislikesCount: 0})
        const result = await this.postRepository.createComment(comment)
        return {...comment, likesInfo: {...comment.likesInfo, myStatus: 'None'}}
    }
}