"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogQueryRepository = void 0;
//import { blogsCollection } from '../repositories/db'
const Blog_1 = require("../models/Blog");
const pagination_1 = require("../helpers/pagination");
//import { postsCollection } from '../repositories/db'
const Post_1 = require("../models/Post");
const inversify_1 = require("inversify");
const postQueryRepository_1 = require("./postQueryRepository");
let BlogQueryRepository = exports.BlogQueryRepository = class BlogQueryRepository {
    constructor(postQueryRepository) {
        this.postQueryRepository = postQueryRepository;
    }
    getBlogs(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const blogs = yield Blog_1.BlogModel.find(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } }, { projection: { _id: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize).lean();
            const count = yield Blog_1.BlogModel.countDocuments(query.searchNameTerm === null ? {} : { name: { $regex: query.searchNameTerm, $options: 'i' } });
            const result = (0, pagination_1.createPaginationResult)(count, query, blogs);
            return result;
        });
    }
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield Blog_1.BlogModel.findOne({ id: id }, { projection: { _id: false } });
            return blog;
        });
    }
    getPostsForSpecifiedBlog(blogId, req, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFinded = (yield this.getBlogById(blogId)) === null;
            if (isFinded) {
                return null;
            }
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            const posts = yield Post_1.PostModel.find(query.searchNameTerm === null ? { blogId: blogId } : { blogId: blogId, name: { $regex: query.searchNameTerm, $options: 'i' } }).select('-_id')
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(query.pageSize).lean();
            const count = yield Post_1.PostModel.countDocuments({ blogId: blogId });
            const result = (0, pagination_1.createPaginationResult)(count, query, posts);
            return yield this.postQueryRepository.editPostToViewModel(result, userId);
        });
    }
};
exports.BlogQueryRepository = BlogQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [postQueryRepository_1.PostQueryRepository])
], BlogQueryRepository);
