"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./routes/video-router");
const post_router_1 = require("./routes/post-router");
const blog_router_1 = require("./routes/blog-router");
const testing_router_1 = require("./routes/testing-router");
const basicAuth_1 = require("./middlewares/basicAuth");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use('/testing/all-data', testing_router_1.testingRouter);
exports.app.use(basicAuth_1.basicAuthMiddleware);
exports.app.use('/videos', video_router_1.videosRouter);
exports.app.use('/posts', post_router_1.postsRouter);
exports.app.use('/blogs', blog_router_1.blogsRouter);
