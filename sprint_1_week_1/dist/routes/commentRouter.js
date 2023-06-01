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
exports.commentsRouter = void 0;
const express_1 = require("express");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const Comment_1 = require("../validation/Comment");
const commentService_1 = require("../domain/commentService");
const resultCode_1 = require("../helpers/resultCode");
const commentQueryRepository_1 = require("../queryRepositories/commentQueryRepository");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.put('/:commentId', jwtAuth_1.authMiddleware, Comment_1.validateComment, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield commentService_1.commentService.updateCommentByid(req.params.commentId, req.body.content, req.user.id);
    if (result.code === resultCode_1.ResultCode.NoContent) {
        return res.sendStatus(204);
    }
    if (result.code === resultCode_1.ResultCode.Forbidden) {
        return res.sendStatus(403);
    }
    return res.status(404).send(result.errorMessage);
}));
exports.commentsRouter.delete('/:id', jwtAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield commentService_1.commentService.deleteCommentById(req.params.id, req.user.id);
    if (result.code === resultCode_1.ResultCode.NoContent) {
        return res.sendStatus(204);
    }
    if (result.code === resultCode_1.ResultCode.Forbidden) {
        return res.sendStatus(403);
    }
    return res.status(404).send(result.errorMessage);
}));
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentQueryRepository_1.commentQueryRepository.getCommentById(req.params.id);
    if (!comment) {
        return res.status(404).send('Comment not found');
    }
    return res.status(200).send(comment);
}));
