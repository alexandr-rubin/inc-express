"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blog_respository_1 = require("../repositories/blog-respository");
const Blog_1 = require("../validation/Blog");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    res.status(200).send(blog_respository_1.blogRepository.getBlogs());
});
exports.blogsRouter.post('/', Blog_1.postBlog, validation_errors_handler_1.validationErrorsHandler, (req, res) => {
    return res.status(201).send(blog_respository_1.blogRepository.addBlog(req.body));
});
