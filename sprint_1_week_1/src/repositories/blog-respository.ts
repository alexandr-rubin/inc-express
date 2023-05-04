import { Blog } from '../models/Blog'

let blogs: Blog[] = [
    {
        "id": "123",
        "name": "blog123",
        "description": "string",
        "websiteUrl": "string"
    },
    {
        "id": "321",
        "name": "blog321",
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
    },
    getBlogById(id: string){
        return blogs.find(blog => blog.id === id)
    },
    updateBlogById(id: string, newblog: Blog) {
        blogs = blogs.map(blog => {
            if (blog.id === id) {
                blog.name = newblog.name
                blog.description = newblog.description
                blog.websiteUrl = newblog.websiteUrl
            }
            return blog
        })
    },
    deleteBlogById(id: string) {
        const newblogs = blogs.filter(blog => blog.id !== id)
        if(newblogs.length < blogs.length) {
            blogs = newblogs
            return true
        }
        else {
            return false
        }
    },
    testingDeleteAllBlogs() {
        blogs = []
    }
}