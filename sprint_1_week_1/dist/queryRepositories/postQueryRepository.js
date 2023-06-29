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
exports.PostQueryRepository = void 0;
// import { commentsCollection, postsCollection } from '../repositories/db'
const Comment_1 = require("../models/Comment");
const Post_1 = require("../models/Post");
const pagination_1 = require("../helpers/pagination");
const Like_1 = require("../models/Like");
class PostQueryRepository {
    getPosts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const posts = yield Post_1.PostModel.find(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } }, { projection: { _id: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize).lean();
            const count = yield Post_1.PostModel.countDocuments(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } });
            const result = (0, pagination_1.createPaginationResult)(count, query, posts);
            return result;
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.PostModel.findOne({ id: id }, { projection: { _id: false } });
            return post;
        });
    }
    getCommentsForSpecifiedPost(postId, req, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFinded = yield this.getPostById(postId);
            if (isFinded === null) {
                return null;
            }
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const comments = yield Comment_1.CommentModel.find({ postId: postId }, { projection: { _id: false, postId: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(query.pageSize).lean();
            //fix
            //const newArray = comments.map(comment => ({...comment, likesInfo:{...comment.likesInfo, myStatus: 'None' }}))
            const newArray = comments.map((_a) => {
                var { _id } = _a, rest = __rest(_a, ["_id"]);
                return (Object.assign(Object.assign({}, rest), { likesInfo: Object.assign(Object.assign({}, rest.likesInfo), { myStatus: 'None' }) }));
            });
            //fix
            for (let i = 0; i < newArray.length; i++) {
                const status = yield Like_1.LikeModel.findOne({ commentId: newArray[i].id, userId: userId });
                if (status) {
                    newArray[i].likesInfo.myStatus = status.likeStatus;
                }
            }
            const count = yield Comment_1.CommentModel.countDocuments({ postId: postId });
            const result = (0, pagination_1.createPaginationResult)(count, query, newArray);
            return result;
        });
    }
}
exports.PostQueryRepository = PostQueryRepository;
