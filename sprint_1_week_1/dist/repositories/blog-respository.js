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
exports.blogRepository = void 0;
const db_1 = require("./db");
exports.blogRepository = {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.find({}).toArray();
        });
    },
    addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            yield db_1.blogsCollection.insertOne(newBlog);
            return newBlog;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.findOne({ _id: id });
        });
    },
    updateBlogById(id, newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.updateOne({ _id: id }, { $set: { newBlog } });
            return result.matchedCount === 1;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ _id: id });
            return result.deletedCount === 1;
        });
    },
    testingDeleteAllBlogs() {
        db_1.blogsCollection.deleteMany({});
    }
};
