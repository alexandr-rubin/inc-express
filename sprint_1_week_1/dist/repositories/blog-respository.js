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
const pagination_1 = require("../helpers/pagination");
const db_2 = require("./db");
exports.blogRepository = {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (query.pageNumber - 1) * query.pageSize;
            const blogs = yield db_1.blogsCollection.find(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } }, { projection: { _id: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize)
                .toArray();
            const result = (0, pagination_1.createPaginationResult)(query, blogs);
            return result;
        });
    },
    addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: return
            return (yield db_1.blogsCollection.insertOne(blog)).acknowledged === true;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.findOne({ id: id }, { projection: { _id: false } });
        });
    },
    updateBlogById(id, newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.updateOne({ id: id }, { $set: { name: newBlog.name, description: newBlog.description, websiteUrl: newBlog.websiteUrl } });
            return result.matchedCount === 1;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    testingDeleteAllBlogs() {
        db_1.blogsCollection.deleteMany({});
    },
    getPostsForSpecifiedBlog(blogId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (query.pageNumber - 1) * query.pageSize;
            const posts = yield db_2.postsCollection.find(query.searchNameTerm === null ? { blogId: blogId } : { blogId: blogId, name: { $regex: query.searchNameTerm, $options: 'i' } }, { projection: { _id: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize)
                .toArray();
            const count = db_2.postsCollection.countDocuments({ blogId: blogId });
            const result = (0, pagination_1.createPaginationResult)(query, posts);
            result.pageCount = +count;
            return result;
        });
    }
};
