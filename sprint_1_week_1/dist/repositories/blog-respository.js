"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepository = void 0;
let blogs = [
    {
        "id": "string",
        "name": "string",
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
    }
};
