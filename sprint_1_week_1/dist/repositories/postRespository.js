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
exports.PostRepository = void 0;
const Post_1 = require("../models/Post");
const Comment_1 = require("../models/Comment");
const mongodb_1 = require("mongodb");
const postQueryRepository_1 = require("../queryRepositories/postQueryRepository");
const inversify_1 = require("inversify");
const Like_1 = require("../models/Like");
let PostRepository = exports.PostRepository = class PostRepository {
    constructor(postQueryRepository) {
        this.postQueryRepository = postQueryRepository;
    }
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: return
            try {
                yield Post_1.PostModel.insertMany([post]);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    updatePostByid(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.PostModel.updateOne(Object.assign(Object.assign({}, newPost), { id: id }));
            return post.acknowledged;
        });
    }
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Post_1.PostModel.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Post_1.PostModel.deleteMany({});
        });
    }
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            //fix
            const post = yield this.postQueryRepository.getPostById(comment.postId, '');
            if (!post) {
                return null;
            }
            const result = Object.assign({}, comment);
            try {
                yield Comment_1.CommentModel.insertMany([comment]);
            }
            catch (err) {
                return null;
            }
            return result;
        });
    }
    updatePostLikeStatus(postId, likeStatus, userId, login) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.PostModel.findOne({ id: postId });
            if (!post) {
                return false;
            }
            const like = yield Like_1.PostLikeModel.findOne({ postId: postId, userId: userId });
            if (!like) {
                const newLike = new Like_1.PostLikeModel({ id: new mongodb_1.ObjectId().toString(), postId: postId, userId: userId, login: login, addedAt: new Date().toISOString(), likeStatus: likeStatus });
                yield newLike.save();
                if (likeStatus === 'Like') {
                    post.extendedLikesInfo.likesCount += 1;
                }
                else {
                    post.extendedLikesInfo.dislikesCount += 1;
                }
                yield post.save();
                return true;
            }
            if (like.likeStatus === likeStatus) {
                return true;
            }
            if (likeStatus === 'None') {
                if (like.likeStatus === 'Like') {
                    post.extendedLikesInfo.likesCount -= 1;
                }
                else {
                    post.extendedLikesInfo.dislikesCount -= 1;
                }
                like.likeStatus = likeStatus;
                yield like.save();
                yield post.save();
                return true;
            }
            if (like.likeStatus !== likeStatus) {
                like.likeStatus = likeStatus;
                yield like.save();
                if (likeStatus === 'Like') {
                    post.extendedLikesInfo.likesCount += 1;
                    post.extendedLikesInfo.dislikesCount -= 1;
                }
                else {
                    post.extendedLikesInfo.likesCount -= 1;
                    post.extendedLikesInfo.dislikesCount += 1;
                }
                yield post.save();
                return true;
            }
            return true;
        });
    }
};
exports.PostRepository = PostRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [postQueryRepository_1.PostQueryRepository])
], PostRepository);
