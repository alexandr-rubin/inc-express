"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepository = void 0;
let blogs = [
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
];
exports.blogRepository = {
    getBlogs() {
        return blogs;
    },
    addBlog(blog) {
        const newBlog = {
            id: (+new Date()).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
        blogs.push(newBlog);
    },
    getBlogById(id) {
        return blogs.find(blog => blog.id === id);
    },
    updateBlogById(id, newblog) {
        blogs = blogs.map(blog => {
            if (blog.id === id) {
                blog.name = newblog.name;
                blog.description = newblog.description;
                blog.websiteUrl = newblog.websiteUrl;
            }
            return blog;
        });
    },
    deleteBlogById(id) {
        const newblogs = blogs.filter(blog => blog.id !== id);
        if (newblogs.length < blogs.length) {
            blogs = newblogs;
            return true;
        }
        else {
            return false;
        }
    },
    testingDeleteAllBlogs() {
        blogs = [];
    }
};
