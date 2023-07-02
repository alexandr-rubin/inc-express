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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const Post_1 = require("../models/Post");
const mongodb_1 = require("mongodb");
const postRespository_1 = require("../repositories/postRespository");
const Comment_1 = require("../models/Comment");
const resultCode_1 = require("../helpers/resultCode");
const blogQueryRepository_1 = require("../queryRepositories/blogQueryRepository");
const likeStatus_1 = require("../helpers/likeStatus");
const inversify_1 = require("inversify");
let PostService = exports.PostService = class PostService {
    constructor(blogQueryRepository, postRepository) {
        this.blogQueryRepository = blogQueryRepository;
        this.postRepository = postRepository;
    }
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogQueryRepository.getBlogById(post.blogId);
            if (!blog) {
                return {
                    code: resultCode_1.ResultCode.NotFound,
                    data: null,
                    errorMessage: 'incorrect id'
                };
            }
            const newPost = new Post_1.Post(new mongodb_1.ObjectId().toString(), post.title, post.shortDescription, post.content, blog.id, blog.name, new Date().toISOString());
            const result = Object.assign({}, newPost);
            yield this.postRepository.addPost(newPost);
            return {
                code: resultCode_1.ResultCode.Success,
                data: result,
                errorMessage: 'OK'
            };
        });
    }
    updatePostByid(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.updatePostByid(id, newPost);
        });
    }
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.deletePostById(id);
        });
    }
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            this.postRepository.testingDeleteAllPosts();
        });
    }
    createComment(user, content, pId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = new Comment_1.Comment(new mongodb_1.ObjectId().toString(), content, { userId: user.id, userLogin: user.login }, new Date().toISOString(), pId, { likesCount: 0, dislikesCount: 0 });
            //fix
            try {
                yield this.postRepository.createComment(comment);
            }
            catch (_a) {
                return null;
            }
            const _b = (Object.assign(Object.assign({}, comment), { likesInfo: Object.assign(Object.assign({}, comment.likesInfo), { myStatus: likeStatus_1.LikeStatuses.None }) })), { postId } = _b, result = __rest(_b, ["postId"]);
            return result;
        });
    }
};
exports.PostService = PostService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogQueryRepository_1.BlogQueryRepository, postRespository_1.PostRepository])
], PostService);
