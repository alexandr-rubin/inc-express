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
exports.testingRouter = void 0;
const express_1 = require("express");
const video_router_1 = require("./video-router");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const authorizationRepository_1 = require("../repositories/authorizationRepository");
const composition_root_1 = require("../composition-root");
const blogRespository_1 = require("../repositories/blogRespository");
const postRespository_1 = require("../repositories/postRespository");
const userRepository_1 = require("../repositories/userRepository");
const commentRepository_1 = require("../repositories/commentRepository");
const blogRepository = composition_root_1.container.resolve(blogRespository_1.BlogRepository);
const postRepository = composition_root_1.container.resolve(postRespository_1.PostRepository);
const userRepository = composition_root_1.container.resolve(userRepository_1.UserRepository);
const commentRepository = composition_root_1.container.resolve(commentRepository_1.CommentRepository);
const authorizationRepository = composition_root_1.container.resolve(authorizationRepository_1.AuthorizationRepository);
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, video_router_1.testingDeleteAllVideos)();
    yield blogRepository.testingDeleteAllBlogs();
    yield postRepository.testingDeleteAllPosts();
    yield userRepository.testingDeleteAllUsers();
    yield commentRepository.testingDeleteAllComments();
    yield authorizationRepository.testingDeleteAllDevices();
    res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('All data is deleted');
}));
