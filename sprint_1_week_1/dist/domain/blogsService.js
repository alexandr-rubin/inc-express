"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.BlogService = void 0;
const Blog_1 = require("../models/Blog");
const mongodb_1 = require("mongodb");
const blogRespository_1 = require("../repositories/blogRespository");
const postsService_1 = require("./postsService");
const blogQueryRepository_1 = require("../queryRepositories/blogQueryRepository");
const inversify_1 = require("inversify");
let BlogService = exports.BlogService = class BlogService {
    constructor(blogRepository, blogQueryRepository, postService) {
        this.blogRepository = blogRepository;
        this.blogQueryRepository = blogQueryRepository;
        this.postService = postService;
    }
    addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = new Blog_1.Blog(new mongodb_1.ObjectId().toString(), blog.name, blog.description, blog.websiteUrl, new Date().toISOString(), false);
            const result = Object.assign({}, newBlog);
            yield this.blogRepository.addBlog(newBlog);
            return result;
        });
    }
    updateBlogById(id, newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogRepository.updateBlogById(id, newBlog);
        });
    }
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogRepository.deleteBlogById(id);
        });
    }
    testingDeleteAllBlogs() {
        this.blogRepository.testingDeleteAllBlogs();
    }
    addPostForSpecificBlog(blogId, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdded = (yield this.blogQueryRepository.getBlogById(blogId)) === null;
            if (isAdded) {
                return null;
            }
            post.blogId = blogId;
            //const result = {...post, blogId}
            return (yield this.postService.addPost(post)).data;
        });
    }
};
exports.BlogService = BlogService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogRespository_1.BlogRepository, blogQueryRepository_1.BlogQueryRepository, postsService_1.PostService])
], BlogService);
