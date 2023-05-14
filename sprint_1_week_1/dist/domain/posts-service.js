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
const blogs_service_1 = require("./blogs-service");
const post_respository_1 = require("../repositories/post-respository");
const pagination_1 = require("../helpers/pagination");
exports.postService = {
    getPosts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const postQuery = (0, pagination_1.createPaginationQuery)(req);
            return yield post_respository_1.postRepository.getPosts(postQuery);
        });
    },
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_service_1.blogService.getBlogById(post.blogId);
            if (!blog) {
                throw new Error(`Blog with id ${post.blogId} not found`);
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
            yield post_respository_1.postRepository.addPost(newPost);
            return result;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_respository_1.postRepository.getPostById(id);
        });
    },
    updatePostByid(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_respository_1.postRepository.updatePostByid(id, newPost);
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_respository_1.postRepository.deletePostById(id);
        });
    },
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            post_respository_1.postRepository.testingDeleteAllPosts();
        });
    }
};
