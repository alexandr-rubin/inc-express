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
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const Like_1 = require("../validation/Like");
const jwtService_1 = require("../application/jwtService");
const composition_root_1 = require("../composition-root");
const commentQueryRepository = composition_root_1.container.resolve(commentQueryRepository_1.CommentQueryRepository);
const jwtService = composition_root_1.container.resolve(jwtService_1.JWTService);
const commentService = composition_root_1.container.resolve(commentService_1.CommentService);
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.put('/:commentId', jwtAuth_1.authMiddleware, Comment_1.validateComment, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield commentService.updateCommentByid(req.params.commentId, req.body.content, req.user.id);
    if (result.code === resultCode_1.ResultCode.NoContent) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
    }
    if (result.code === resultCode_1.ResultCode.Forbidden) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.FORBIDDEN_403);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send(result.errorMessage);
}));
exports.commentsRouter.delete('/:id', jwtAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield commentService.deleteCommentById(req.params.id, req.user.id);
    if (result.code === resultCode_1.ResultCode.NoContent) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
    }
    if (result.code === resultCode_1.ResultCode.Forbidden) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.FORBIDDEN_403);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send(result.errorMessage);
}));
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //wtf откуда токен
    let userId = '';
    const auth = req.headers.authorization;
    if (auth) {
        const token = auth.split(' ')[1];
        userId = yield jwtService.getUserIdByToken(token);
    }
    const comment = yield commentQueryRepository.getCommentById(req.params.id, userId);
    if (!comment) {
        return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send('Comment not found');
    }
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(comment);
}));
exports.commentsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(yield commentQueryRepository.getAllComments());
}));
exports.commentsRouter.put('/:commentId/like-status', jwtAuth_1.authMiddleware, Like_1.validateLike, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield commentService.updateCommentLikeStatus(req.params.commentId, req.body.likeStatus, req.user.id);
    if (!result) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404);
    }
    return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
}));
