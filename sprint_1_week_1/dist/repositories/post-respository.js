"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const blog_respository_1 = require("./blog-respository");
let posts = [
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
];
exports.postRepository = {
    getPosts() {
        return posts;
    },
    addPost(post) {
        const blog = blog_respository_1.blogRepository.getBlogById(post.blogId);
        if (!blog) {
            throw new Error(`Blog with id ${post.blogId} not found`);
        }
        const newPost = {
            id: (+new Date()).toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog.name
        };
        posts.push(newPost);
    },
    getPostById(id) {
        return posts.find(post => post.id === id);
    },
    updatePostByid(id, newPost) {
        const blog = blog_respository_1.blogRepository.getBlogById(newPost.blogId);
        if (!blog) {
            throw new Error(`Blog with id ${newPost.blogId} not found`);
        }
        const post = posts.find(post => post.id === id);
        if (!post) {
            throw new Error(`Post with id ${id} not found`);
        }
        post.title = newPost.title;
        post.shortDescription = newPost.shortDescription;
        post.content = newPost.content;
        post.blogId = newPost.blogId;
        post.blogName = blog.name;
    },
    deletePostById(id) {
        const newPosts = posts.filter(post => post.id !== id);
        if (newPosts.length < posts.length) {
            posts = newPosts;
            return true;
        }
        else {
            return false;
        }
    },
    testingDeleteAllPosts() {
        posts = [];
    }
};
