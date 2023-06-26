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
const Post_1 = require("../models/Post");
const Comment_1 = require("../models/Comment");
const postQueryRepository_1 = require("../queryRepositories/postQueryRepository");
exports.postRepository = {
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
    },
    updatePostByid(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.PostModel.updateOne(Object.assign(Object.assign({}, newPost), { id: id }));
            return post.acknowledged;
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Post_1.PostModel.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Post_1.PostModel.deleteMany({});
        });
    },
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postQueryRepository_1.postQueryRepository.getPostById(comment.postId);
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
};
