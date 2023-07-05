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
exports.CommentRepository = void 0;
//import { commentsCollection } from './db'
const Comment_1 = require("../models/Comment");
const resultCode_1 = require("../helpers/resultCode");
const commentQueryRepository_1 = require("../queryRepositories/commentQueryRepository");
const Like_1 = require("../models/Like");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
let CommentRepository = exports.CommentRepository = class CommentRepository {
    constructor(commentQueryRepository) {
        this.commentQueryRepository = commentQueryRepository;
    }
    updateCommentById(id, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentQueryRepository.getCommentById(id, userId);
            if (comment && comment.commentatorInfo.userId !== userId) {
                return {
                    code: resultCode_1.ResultCode.Forbidden,
                    data: null,
                    errorMessage: "Forbidden"
                };
            }
            const result = yield Comment_1.CommentModel.updateOne({ id: id }, { content });
            if (result.matchedCount === 1) {
                return {
                    code: resultCode_1.ResultCode.NoContent,
                    data: true,
                    errorMessage: "Updated"
                };
            }
            return {
                code: resultCode_1.ResultCode.NotFound,
                data: false,
                errorMessage: "Not Found"
            };
        });
    }
    deleteCommentById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentQueryRepository.getCommentById(id, userId);
            if (comment && comment.commentatorInfo.userId !== userId) {
                return {
                    code: resultCode_1.ResultCode.Forbidden,
                    data: null,
                    errorMessage: "Forbidden"
                };
            }
            const result = yield Comment_1.CommentModel.deleteOne({ id: id });
            if (result.deletedCount === 1) {
                return {
                    code: resultCode_1.ResultCode.NoContent,
                    data: true,
                    errorMessage: "Deleted"
                };
            }
            return {
                code: resultCode_1.ResultCode.NotFound,
                data: false,
                errorMessage: "Not Found"
            };
        });
    }
    updateCommentLikeStatus(commentId, likeStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield Comment_1.CommentModel.findOne({ id: commentId });
            if (!comment) {
                return false;
            }
            const like = yield Like_1.CommentLikeModel.findOne({ commentId: commentId, userId: userId });
            if (!like) {
                const newLike = new Like_1.CommentLikeModel({ id: new mongodb_1.ObjectId().toString(), commentId: commentId, userId: userId, likeStatus: likeStatus });
                yield newLike.save();
                if (likeStatus === 'Like') {
                    comment.likesInfo.likesCount += 1;
                }
                else {
                    comment.likesInfo.dislikesCount += 1;
                }
                yield comment.save();
                return true;
            }
            if (like.likeStatus === likeStatus) {
                return true;
            }
            if (likeStatus === 'None') {
                if (like.likeStatus === 'Like') {
                    comment.likesInfo.likesCount -= 1;
                }
                else {
                    comment.likesInfo.dislikesCount -= 1;
                }
                like.likeStatus = likeStatus;
                yield like.save();
                yield comment.save();
                return true;
            }
            if (like.likeStatus !== likeStatus) {
                like.likeStatus = likeStatus;
                yield like.save();
                if (likeStatus === 'Like') {
                    comment.likesInfo.likesCount += 1;
                    comment.likesInfo.dislikesCount -= 1;
                }
                else {
                    comment.likesInfo.likesCount -= 1;
                    comment.likesInfo.dislikesCount += 1;
                }
                yield comment.save();
                return true;
            }
            return true;
        });
    }
    // async createCommentLikeOrDislike(newLike: Like, comment: Comment): Promise<boolean> {
    //     const isCreated = await LikeModel.create(newLike)
    //         if(newLike.likeStatus === 'Like'){
    //             const isUpdated = await CommentModel.updateOne({id: newLike.commentId}, {$set: {'likesInfo.likesCount': comment.likesInfo.likesCount + 1}})
    //         }
    //         if(newLike.likeStatus === 'Dislike'){
    //             const isUpdated = await CommentModel.updateOne({id: newLike.commentId}, {$set: {'likesInfo.dislikesCount': comment.likesInfo.dislikesCount + 1}})
    //         }
    //         // fix update validation and create validation
    //         return true
    // }
    testingDeleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Comment_1.CommentModel.deleteMany({});
        });
    }
};
exports.CommentRepository = CommentRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [commentQueryRepository_1.CommentQueryRepository])
], CommentRepository);
