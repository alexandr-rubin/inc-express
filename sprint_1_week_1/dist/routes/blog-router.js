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
const blog_respository_1 = require("../repositories/blog-respository");
const Blog_1 = require("../validation/Blog");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const mongodb_1 = require("mongodb");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield blog_respository_1.blogRepository.getBlogs());
}));
exports.blogsRouter.post('/', Blog_1.validateBlog, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send(yield blog_respository_1.blogRepository.addBlog(req.body));
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_respository_1.blogRepository.getBlogById(new mongodb_1.ObjectId(req.params.id));
    if (blog) {
        res.status(200).send(blog);
    }
    else {
        res.status(404).send('Blog not found');
    }
}));
exports.blogsRouter.put('/:id', Blog_1.validateBlog, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_respository_1.blogRepository.updateBlogById(new mongodb_1.ObjectId(req.params.id), req.body);
    if (blog) {
        return res.sendStatus(204);
    }
    return res.status(404).send('Not found');
}));
exports.blogsRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield blog_respository_1.blogRepository.deleteBlogById(new mongodb_1.ObjectId(req.params.id))) {
        res.status(204).send('Blog deleted');
    }
    else {
        res.status(404).send('Blog not found');
    }
}));
