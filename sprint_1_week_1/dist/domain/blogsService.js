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
exports.blogService = void 0;
const mongodb_1 = require("mongodb");
const blogRespository_1 = require("../repositories/blogRespository");
const postsService_1 = require("./postsService");
const blogQueryRepository_1 = require("../queryRepositories/blogQueryRepository");
exports.blogService = {
    addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: new mongodb_1.ObjectId().toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const result = Object.assign({}, newBlog);
            yield blogRespository_1.blogRepository.addBlog(newBlog);
            return result;
        });
    },
    updateBlogById(id, newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRespository_1.blogRepository.updateBlogById(id, newBlog);
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRespository_1.blogRepository.deleteBlogById(id);
        });
    },
    testingDeleteAllBlogs() {
        blogRespository_1.blogRepository.testingDeleteAllBlogs();
    },
    addPostForSpecificBlog(blogId, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdded = (yield blogQueryRepository_1.blogQueryRepository.getBlogById(blogId)) === null;
            if (isAdded) {
                return null;
            }
            post.blogId = blogId;
            //const result = {...post, blogId}
            return (yield postsService_1.postService.addPost(post)).data;
        });
    }
};
