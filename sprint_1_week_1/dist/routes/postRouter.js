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
exports.postsRouter = void 0;
const express_1 = require("express");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const Post_1 = require("../validation/Post");
const postsService_1 = require("../domain/postsService");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield postsService_1.postService.getPosts(req));
}));
exports.postsRouter.post('/', Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send(yield postsService_1.postService.addPost(req.body));
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield postsService_1.postService.getPostById(req.params.id);
    if (blog) {
        return res.status(200).send(blog);
    }
    return res.status(404).send('Post not found');
}));
exports.postsRouter.put('/:id', Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postsService_1.postService.updatePostByid(req.params.id, req.body);
    if (post) {
        return res.status(204).send(post);
    }
    return res.status(404).send('Not found');
}));
exports.postsRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield postsService_1.postService.deletePostById(req.params.id)) {
        res.status(204).send('Post deleted');
    }
    res.status(404).send('Post not found');
}));
