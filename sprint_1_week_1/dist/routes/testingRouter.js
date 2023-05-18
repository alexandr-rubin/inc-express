"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const video_router_1 = require("./video-router");
const blogRespository_1 = require("../repositories/blogRespository");
const postRespository_1 = require("../repositories/postRespository");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/', (req, res) => {
    (0, video_router_1.testingDeleteAllVideos)();
    blogRespository_1.blogRepository.testingDeleteAllBlogs();
    postRespository_1.postRepository.testingDeleteAllPosts();
    res.status(204).send('All data is deleted');
});
