import { Blog } from '../models/Blog'

let blogs: Blog[] = [
    {
        "id": "string",
        "name": "string",
        "description": "string",
        "websiteUrl": "string"
    }
]

export const blogRepository = {
    getBlogs(){
        return blogs
    },
    addBlog(blog: Blog) {
        const newBlog: Blog = {
            id: (+new Date()).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }
        blogs.push(newBlog)
    }
    
}