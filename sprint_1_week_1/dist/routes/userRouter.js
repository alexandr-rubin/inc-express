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
exports.usersRouter = void 0;
const express_1 = require("express");
const User_1 = require("../validation/User");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const userService_1 = require("../domain/userService");
const basicAuth_1 = require("../middlewares/basicAuth");
const userQuertyRepository_1 = require("../queryRepositories/userQuertyRepository");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(yield userQuertyRepository_1.userQueryRepository.getUsers(req));
}));
exports.usersRouter.post('/', basicAuth_1.basicAuthMiddleware, User_1.validateUser, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.userService.addUser(req.body);
    return res.status(httpStatusCode_1.HttpStatusCode.CREATED_201).send(user);
}));
exports.usersRouter.delete('/:id', basicAuth_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield userService_1.userService.deleteUserById(req.params.id);
    if (!isDeleted) {
        return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404).send('User not found');
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('User deleted');
}));
