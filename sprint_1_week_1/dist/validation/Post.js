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
exports.validatePostForBlog = exports.validatePost = void 0;
const express_validator_1 = require("express-validator");
const blogQueryRepository_1 = require("../queryRepositories/blogQueryRepository");
const blogQueryRepositoryInst = new blogQueryRepository_1.BlogQueryRepository();
exports.validatePost = [
    (0, express_validator_1.body)('title').notEmpty().isString().trim().isLength({ min: 1, max: 30 }),
    (0, express_validator_1.body)('shortDescription').notEmpty().isString().trim().isLength({ min: 1, max: 100 }),
    (0, express_validator_1.body)('content').notEmpty().isString().trim().isLength({ min: 1, max: 1000 }),
    (0, express_validator_1.body)('blogId').notEmpty().isString().custom((id) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blogQueryRepositoryInst.getBlogById(id);
        if (!blog) {
            throw new Error('Blog not found');
        }
    }))
];
exports.validatePostForBlog = [
    (0, express_validator_1.body)('title').notEmpty().isString().trim().isLength({ min: 1, max: 30 }),
    (0, express_validator_1.body)('shortDescription').notEmpty().isString().trim().isLength({ min: 1, max: 100 }),
    (0, express_validator_1.body)('content').notEmpty().isString().trim().isLength({ min: 1, max: 1000 })
];
