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
const jwtAuth_1 = require("../middlewares/jwtAuth");
const Comment_1 = require("../validation/Comment");
const basicAuth_1 = require("../middlewares/basicAuth");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const composition_root_1 = require("../composition-root");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(yield composition_root_1.postQueryRepository.getPosts(req));
}));
exports.postsRouter.post('/', basicAuth_1.basicAuthMiddleware, Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield composition_root_1.postService.addPost(req.body);
    return res.status(httpStatusCode_1.HttpStatusCode.CREATED_201).send(result.data);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield composition_root_1.postQueryRepository.getPostById(req.params.id);
    if (!blog) {
        return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send('Post not found');
    }
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(blog);
}));
exports.postsRouter.put('/:id', basicAuth_1.basicAuthMiddleware, Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield composition_root_1.postService.updatePostByid(req.params.id, req.body);
    if (!post) {
        return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send('Not found');
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send(post);
}));
exports.postsRouter.delete('/:id', basicAuth_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield composition_root_1.postService.deletePostById(req.params.id);
    if (!isDeleted) {
        return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send('Post not found');
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('Post deleted');
}));
exports.postsRouter.post('/:postId/comments', jwtAuth_1.authMiddleware, Comment_1.validateComment, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield composition_root_1.postService.createComment(req.user, req.body.content, req.params.postId);
    if (comment === null) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.CREATED_201).send(comment);
}));
exports.postsRouter.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //fix
    let userId = '';
    const auth = req.headers.authorization;
    if (auth) {
        const token = auth.split(' ')[1];
        userId = yield composition_root_1.jwtService.getUserIdByToken(token);
    }
    const comments = yield composition_root_1.postQueryRepository.getCommentsForSpecifiedPost(req.params.postId, req, userId);
    if (comments === null) {
        return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send('Post not found');
    }
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(comments);
}));
