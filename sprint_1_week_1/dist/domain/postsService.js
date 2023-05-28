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
exports.postService = void 0;
const mongodb_1 = require("mongodb");
const blogsService_1 = require("./blogsService");
const postRespository_1 = require("../repositories/postRespository");
const pagination_1 = require("../helpers/pagination");
const resultCode_1 = require("../helpers/resultCode");
exports.postService = {
    getPosts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const postQuery = (0, pagination_1.createPaginationQuery)(req);
            return yield postRespository_1.postRepository.getPosts(postQuery);
        });
    },
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsService_1.blogService.getBlogById(post.blogId);
            if (!blog) {
                return {
                    code: resultCode_1.ResultCode.NotFound,
                    data: null,
                    errorMessage: 'incorrect id'
                };
            }
            const newPost = {
                id: new mongodb_1.ObjectId().toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            const result = Object.assign({}, newPost);
            yield postRespository_1.postRepository.addPost(newPost);
            return {
                code: resultCode_1.ResultCode.Success,
                data: result,
                errorMessage: 'OK'
            };
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRespository_1.postRepository.getPostById(id);
        });
    },
    updatePostByid(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRespository_1.postRepository.updatePostByid(id, newPost);
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRespository_1.postRepository.deletePostById(id);
        });
    },
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            postRespository_1.postRepository.testingDeleteAllPosts();
        });
    },
    createComment(user, content, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRespository_1.postRepository.createComment(user, content, postId);
        });
    },
    getCommentsForSpecifiedPost(postId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield postRespository_1.postRepository.getPostById(postId)) === null) {
                return null;
            }
            const postQuery = (0, pagination_1.createPaginationQuery)(req);
            return yield postRespository_1.postRepository.getCommentsForSpecifiedPost(postId, postQuery);
        });
    },
};
