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
exports.verifyRefreshTokenMiddleware = void 0;
const jwtService_1 = require("../application/jwtService");
const userQuertyRepository_1 = require("../queryRepositories/userQuertyRepository");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const authorizationRepository_1 = require("../repositories/authorizationRepository");
const verifyRefreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401);
    }
    const dbToken = yield authorizationRepository_1.authorizationRepository.getRefreshToken(token);
    if (!dbToken || !dbToken.isValid) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401);
    }
    const userId = yield jwtService_1.jwtService.getUserIdByToken(token);
    if (userId === null) {
        yield authorizationRepository_1.authorizationRepository.updateRefreshToken(token);
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401);
    }
    const user = yield userQuertyRepository_1.userQueryRepository.getUserById(userId);
    if (!user) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    req.user = user;
    return next();
});
exports.verifyRefreshTokenMiddleware = verifyRefreshTokenMiddleware;
