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
exports.postRepository = void 0;
const db_1 = require("./db");
const pagination_1 = require("../helpers/pagination");
const mongodb_1 = require("mongodb");
const postsService_1 = require("../domain/postsService");
exports.postRepository = {
    getPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
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
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: return
            return (yield db_1.postsCollection.insertOne(post)).acknowledged === true;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.findOne({ id: id }, { projection: { _id: false } });
        });
    },
    updatePostByid(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.updateOne({ id: id }, { $set: { title: newPost.title, shortDescription: newPost.shortDescription, content: newPost.content, blogId: newPost.blogId } });
            return result.matchedCount === 1;
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            db_1.postsCollection.deleteMany({});
        });
    },
    createComment(user, content, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postsService_1.postService.getPostById(postId);
            if (!post) {
                return null;
            }
            const comment = {
                id: new mongodb_1.ObjectId().toString(),
                content: content,
                commentatorInfo: {
                    userId: user.id,
                    userLogin: user.login
                },
                createdAt: new Date().toISOString(),
                postId: postId
            };
            const result = Object.assign({}, comment);
            db_1.commentsCollection.insertOne(comment);
            return result;
        });
    },
    getCommentsForSpecifiedPost(postId, query) {
        return __awaiter(this, void 0, void 0, function* () {
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
