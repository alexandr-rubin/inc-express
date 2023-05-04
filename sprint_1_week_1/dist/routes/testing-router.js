"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const video_router_1 = require("./video-router");
const blog_respository_1 = require("../repositories/blog-respository");
const post_respository_1 = require("../repositories/post-respository");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/', (req, res) => {
    (0, video_router_1.testingDeleteAllVideos)();
    blog_respository_1.blogRepository.testingDeleteAllBlogs();
    post_respository_1.postRepository.testingDeleteAllPosts();
    res.status(204).send('All data is deleted');
});
