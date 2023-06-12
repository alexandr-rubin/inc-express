"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./routes/video-router");
const postRouter_1 = require("./routes/postRouter");
const blogRouter_1 = require("./routes/blogRouter");
const testingRouter_1 = require("./routes/testingRouter");
const userRouter_1 = require("./routes/userRouter");
const authorizationRouter_1 = require("./routes/authorizationRouter");
const commentRouter_1 = require("./routes/commentRouter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const securityRouter_1 = require("./routes/securityRouter");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use('/security/', securityRouter_1.securityRouter);
exports.app.use('/testing/all-data', testingRouter_1.testingRouter);
exports.app.use('/auth', authorizationRouter_1.authorizationRouterRouter);
exports.app.use('/comments', commentRouter_1.commentsRouter);
//app.use(basicAuthMiddleware)
exports.app.use('/videos', video_router_1.videosRouter);
exports.app.use('/posts', postRouter_1.postsRouter);
exports.app.use('/blogs', blogRouter_1.blogsRouter);
exports.app.use('/users', userRouter_1.usersRouter);
