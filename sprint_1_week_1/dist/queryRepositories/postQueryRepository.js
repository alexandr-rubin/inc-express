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
exports.postQueryRepository = void 0;
const db_1 = require("../repositories/db");
const pagination_1 = require("../helpers/pagination");
exports.postQueryRepository = {
    getPosts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const posts = yield db_1.postsCollection.find(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } }, { projection: { _id: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize)
                .toArray();
            const count = yield db_1.postsCollection.countDocuments(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } });
            const result = (0, pagination_1.createPaginationResult)(count, query, posts);
            return result;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ id: id }, { projection: { _id: false } });
            return post;
        });
    },
    getCommentsForSpecifiedPost(postId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFinded = (yield this.getPostById(postId)) === null;
            if (isFinded) {
                return null;
            }
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const comments = yield db_1.commentsCollection.find({ postId: postId }, { projection: { _id: false, postId: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(query.pageSize)
                .toArray();
            const count = yield db_1.commentsCollection.countDocuments({ postId: postId });
            const result = (0, pagination_1.createPaginationResult)(count, query, comments);
            return result;
        });
    }
};
