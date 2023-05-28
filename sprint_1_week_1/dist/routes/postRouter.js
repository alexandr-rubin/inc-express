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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const Post_1 = require("../validation/Post");
const postsService_1 = require("../domain/postsService");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const Comment_1 = require("../validation/Comment");
const basicAuth_1 = require("../middlewares/basicAuth");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield postsService_1.postService.getPosts(req));
}));
exports.postsRouter.post('/', basicAuth_1.basicAuthMiddleware, Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postsService_1.postService.addPost(req.body);
    return res.status(201).send(result.data);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield postsService_1.postService.getPostById(req.params.id);
    if (blog) {
        return res.status(200).send(blog);
    }
    return res.status(404).send('Post not found');
}));
exports.postsRouter.put('/:id', basicAuth_1.basicAuthMiddleware, Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postsService_1.postService.updatePostByid(req.params.id, req.body);
    if (post) {
        return res.status(204).send(post);
    }
    return res.status(404).send('Not found');
}));
exports.postsRouter.delete('/:id', basicAuth_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield postsService_1.postService.deletePostById(req.params.id)) {
        return res.status(204).send('Post deleted');
    }
    return res.status(404).send('Post not found');
}));
exports.postsRouter.post('/:postId/comments', jwtAuth_1.authMiddleware, Comment_1.validateComment, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield postsService_1.postService.createComment(req.user, req.body.content, req.params.postId);
    if (comment !== null) {
        const { postId } = comment, result = __rest(comment, ["postId"]);
        return res.status(201).send(result);
    }
    else {
        return res.sendStatus(404);
    }
}));
exports.postsRouter.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield postsService_1.postService.getCommentsForSpecifiedPost(req.params.postId, req);
    if (comments === null) {
        return res.status(404).send('Post not found');
    }
    return res.status(200).send(comments);
}));
