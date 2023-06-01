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
const mongodb_1 = require("mongodb");
const postQueryRepository_1 = require("../queryRepositories/postQueryRepository");
exports.postRepository = {
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: return
            const isAdded = (yield db_1.postsCollection.insertOne(post)).acknowledged === true;
            return isAdded;
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
            const post = yield postQueryRepository_1.postQueryRepository.getPostById(postId);
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
            const isAdded = yield db_1.commentsCollection.insertOne(comment);
            if (isAdded.acknowledged === false) {
                return null;
            }
            return result;
        });
    }
};
