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
exports.commentRepository = void 0;
//import { commentsCollection } from './db'
const Comment_1 = require("../models/Comment");
const resultCode_1 = require("../helpers/resultCode");
const commentQueryRepository_1 = require("../queryRepositories/commentQueryRepository");
exports.commentRepository = {
    updateCommentById(id, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentQueryRepository_1.commentQueryRepository.getCommentById(id);
            if (comment && comment.commentatorInfo.userId !== userId) {
                return {
                    code: resultCode_1.ResultCode.Forbidden,
                    data: null,
                    errorMessage: "Forbidden"
                };
            }
            const result = yield Comment_1.CommentModel.updateOne({ id: id }, { $set: { content: content } });
            if (result.matchedCount === 1) {
                return {
                    code: resultCode_1.ResultCode.NoContent,
                    data: true,
                    errorMessage: "Updated"
                };
            }
            return {
                code: resultCode_1.ResultCode.NotFound,
                data: false,
                errorMessage: "Not Found"
            };
        });
    },
    deleteCommentById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentQueryRepository_1.commentQueryRepository.getCommentById(id);
            if (comment && comment.commentatorInfo.userId !== userId) {
                return {
                    code: resultCode_1.ResultCode.Forbidden,
                    data: null,
                    errorMessage: "Forbidden"
                };
            }
            const result = yield Comment_1.CommentModel.deleteOne({ id: id });
            if (result.deletedCount === 1) {
                return {
                    code: resultCode_1.ResultCode.NoContent,
                    data: true,
                    errorMessage: "Deleted"
                };
            }
            return {
                code: resultCode_1.ResultCode.NotFound,
                data: false,
                errorMessage: "Not Found"
            };
        });
    },
    testingDeleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Comment_1.CommentModel.deleteMany({});
        });
    },
};
