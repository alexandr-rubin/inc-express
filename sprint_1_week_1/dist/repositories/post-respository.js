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
const blog_respository_1 = require("./blog-respository");
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
exports.postRepository = {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.find({}, { projection: { _id: false } }).toArray();
        });
    },
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_respository_1.blogRepository.getBlogById(post.blogId);
            if (!blog) {
                throw new Error(`Blog with id ${post.blogId} not found`);
            }
            const newPost = {
                id: new mongodb_1.ObjectId().toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            const result = Object.assign({}, newPost);
            yield db_1.postsCollection.insertOne(newPost);
            return result;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.findOne({ id: id }, { projection: { _id: false } });
        });
    },
    updatePostByid(id, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.updateOne({ id: id }, { $Set: { title: newPost.title, shortDescription: newPost.shortDescription, content: newPost, blogId: newPost.blogId } });
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
    }
};
