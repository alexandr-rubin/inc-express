import { title } from 'process'
import { Post } from '../models/Post'
import { blogRepository } from './blog-respository'

let posts: Post[] = [
    {
        "id": "qwerty",
        "title": "zxc",
        "shortDescription": "rdsfsdfdsf",
        "content": "string",
        "blogId": "123",
        "blogName": "blog123"
      },
      {
        "id": "zxc",
        "title": "asdfd",
        "shortDescription": "kekw",
        "content": "string",
        "blogId": "321",
        "blogName": "blog321"
      }
]

export const postRepository = {
    getPosts(){
        return posts
    },
    addPost(post: Post) {
        const blog = blogRepository.getBlogById(post.blogId)
        if (!blog) {
            throw new Error(`Blog with id ${post.blogId} not found`)
        }
        const newPost: Post = {
            id: (+new Date()).toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog.name
        }
        posts.push(newPost)
        return newPost
    },
    getPostById(id: string){
        return posts.find(post => post.id === id)
    },
    updatePostByid(id: string, newPost: Post) {
        const blog = blogRepository.getBlogById(newPost.blogId)
        if (!blog) {
            throw new Error(`Post with id ${newPost.blogId} not found`)
        }
        const post = posts.find(post => post.id === id)
        if (!post) {
            throw new Error(`Post with id ${id} not found`)
        }
        post.title = newPost.title
        post.shortDescription = newPost.shortDescription
        post.content = newPost.content
        post.blogId = newPost.blogId
        post.blogName = blog.name
    },
    deletePostById(id: string){
        const newPosts = posts.filter(post => post.id !== id)
        if(newPosts.length < posts.length){
            posts = newPosts
            return true
        }
        else {
            return false
        }
    },
    testingDeleteAllPosts() {
        posts = []
    }
}