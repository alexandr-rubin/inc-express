"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CommentQueryRepository = void 0;
//import { commentsCollection } from '../repositories/db'
const inversify_1 = require("inversify");
const likeStatus_1 = require("../helpers/likeStatus");
const Comment_1 = require("../models/Comment");
const Like_1 = require("../models/Like");
let CommentQueryRepository = exports.CommentQueryRepository = class CommentQueryRepository {
    getCommentById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            //fix typization
            const like = yield Like_1.LikeModel.findOne({ commentId: id, userId: userId }).lean();
            const likeStatus = like === null ? likeStatus_1.LikeStatuses.None : like.likeStatus;
            const comment = yield Comment_1.CommentModel.findOne({ id: id }, { projection: { _id: false, postId: false } }).lean();
            if (comment) {
                const result = Object.assign(Object.assign({}, comment), { likesInfo: Object.assign(Object.assign({}, comment.likesInfo), { myStatus: likeStatus }) });
                const { _id, postId } = result, newResult = __rest(result, ["_id", "postId"]);
                return newResult;
            }
            return null;
        });
    }
    getAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield Comment_1.CommentModel.find({}).lean();
            return comments;
        });
    }
};
exports.CommentQueryRepository = CommentQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentQueryRepository);
