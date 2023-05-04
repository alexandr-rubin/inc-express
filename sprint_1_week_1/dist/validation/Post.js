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
exports.validatePost = void 0;
const express_validator_1 = require("express-validator");
const blog_respository_1 = require("../repositories/blog-respository");
exports.validatePost = [
    (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 30 }),
    (0, express_validator_1.body)('shortDescription').trim().isLength({ min: 1, max: 100 }),
    (0, express_validator_1.body)('content').trim().isLength({ min: 1, max: 1000 }),
    (0, express_validator_1.body)('blogId').custom((id) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blog_respository_1.blogRepository.getBlogById(id);
        if (!blog) {
            throw new Error('Blog not found');
        }
    }))
];
