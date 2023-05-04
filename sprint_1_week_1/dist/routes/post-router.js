"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const post_respository_1 = require("../repositories/post-respository");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const Post_1 = require("../validation/Post");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    res.status(200).send(post_respository_1.postRepository.getPosts());
});
exports.postsRouter.post('/', Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => {
    return res.status(201).send(post_respository_1.postRepository.addPost(req.body));
});
exports.postsRouter.get('/:id', (req, res) => {
    const blog = post_respository_1.postRepository.getPostById(req.params.id);
    if (blog !== undefined) {
        res.status(200).send(blog);
    }
    else {
        res.status(404).send('Post not found');
    }
});
exports.postsRouter.put('/:id', Post_1.validatePost, validation_errors_handler_1.validationErrorsHandler, (req, res) => {
    return res.status(204).send(post_respository_1.postRepository.updatePostByid(req.params.id, req.body));
});
exports.postsRouter.delete('/:id', (req, res) => {
    if (post_respository_1.postRepository.deletePostById(req.params.id)) {
        res.status(204).send('Post deleted');
    }
    else {
        res.status(404).send('Post not found');
    }
});
