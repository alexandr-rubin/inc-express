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
const blog_respository_1 = require("../repositories/blog-respository");
const pagination_1 = require("../helpers/pagination");
const posts_service_1 = require("./posts-service");
exports.blogService = {
    getBlogs(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogQuery = (0, pagination_1.createPaginationQuery)(req);
            return yield blog_respository_1.blogRepository.getBlogs(blogQuery);
        });
    },
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
            yield blog_respository_1.blogRepository.addBlog(newBlog);
            return result;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_respository_1.blogRepository.getBlogById(id);
        });
    },
    updateBlogById(id, newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_respository_1.blogRepository.updateBlogById(id, newBlog);
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_respository_1.blogRepository.deleteBlogById(id);
        });
    },
    testingDeleteAllBlogs() {
        blog_respository_1.blogRepository.testingDeleteAllBlogs();
    },
    getPostsForSpecifiedBlog(blogId, req) {
        const postQuery = (0, pagination_1.createPaginationQuery)(req);
        return blog_respository_1.blogRepository.getPostsForSpecifiedBlog(blogId, postQuery);
    },
    addPostForSpecificBlog(blogId, post) {
        post.blogId = blogId;
        return posts_service_1.postService.addPost(post);
    }
};
