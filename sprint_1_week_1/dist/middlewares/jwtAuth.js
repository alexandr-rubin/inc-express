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
exports.authMiddleware = void 0;
const jwtService_1 = require("../application/jwtService");
const userQuertyRepository_1 = require("../queryRepositories/userQuertyRepository");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwtService_1.jwtService.getUserIdByToken(token);
    if (userId) {
        const user = (yield userQuertyRepository_1.userQueryRepository.getUsers(req)).items.find(item => item.id === userId);
        req.user = user;
        return next();
    }
    return res.sendStatus(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401);
});
exports.authMiddleware = authMiddleware;
