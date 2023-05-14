"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const Blog_1 = require("../validation/Blog");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const blogs_service_1 = require("../domain/blogs-service");
const Post_1 = require("../validation/Post");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send(yield blogs_service_1.blogService.getBlogs(req));
}));
exports.blogsRouter.post('/', Blog_1.validateBlog, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send(yield blogs_service_1.blogService.addBlog(req.body));
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_service_1.blogService.getBlogById(req.params.id);
    if (blog) {
        return res.status(200).send(blog);
    }
    else {
        return res.status(404).send('Blog not found');
    }
}));
exports.blogsRouter.put('/:id', Blog_1.validateBlog, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_service_1.blogService.updateBlogById(req.params.id, req.body);
    if (blog) {
        return res.sendStatus(204);
    }
    return res.status(404).send('Not found');
}));
exports.blogsRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield blogs_service_1.blogService.deleteBlogById(req.params.id)) {
        return res.status(204).send('Blog deleted');
    }
    else {
        return res.status(404).send('Blog not found');
    }
}));
exports.blogsRouter.get('/:blogId/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield blogs_service_1.blogService.getPostsForSpecifiedBlog(req.params.blogId, req);
    if (posts === null) {
        return res.status(404).send('Blog not found');
    }
    return res.status(200).send(posts);
}));
exports.blogsRouter.post('/:blogId/posts', Post_1.validatePostForBlog, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield blogs_service_1.blogService.addPostForSpecificBlog(req.params.blogId, req.body);
    if (post === null) {
        return res.status(404).send('Blog not found');
    }
    return res.status(201).send(post);
}));
