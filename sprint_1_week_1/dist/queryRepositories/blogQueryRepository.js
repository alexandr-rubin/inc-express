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
exports.blogQueryRepository = void 0;
const db_1 = require("../repositories/db");
const pagination_1 = require("../helpers/pagination");
const db_2 = require("../repositories/db");
exports.blogQueryRepository = {
    getBlogs(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const blogs = yield db_1.blogsCollection.find(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } }, { projection: { _id: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize)
                .toArray();
            const count = yield db_1.blogsCollection.countDocuments(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } });
            const result = (0, pagination_1.createPaginationResult)(count, query, blogs);
            return result;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.findOne({ id: id }, { projection: { _id: false } });
        });
    },
    getPostsForSpecifiedBlog(blogId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.getBlogById(blogId)) === null) {
                return null;
            }
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const posts = yield db_2.postsCollection.find(query.searchNameTerm === null ? { blogId: blogId } : { blogId: blogId, name: { $regex: query.searchNameTerm, $options: 'i' } }, { projection: { _id: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(query.pageSize)
                .toArray();
            const count = yield db_2.postsCollection.countDocuments({ blogId: blogId });
            const result = (0, pagination_1.createPaginationResult)(count, query, posts);
            return result;
        });
    }
};
