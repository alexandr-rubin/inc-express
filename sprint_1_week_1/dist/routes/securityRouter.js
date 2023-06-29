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
exports.securityRouter = void 0;
const express_1 = require("express");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const verifyRefreshToken_1 = require("../middlewares/verifyRefreshToken");
const composition_root_1 = require("../composition-root");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', verifyRefreshToken_1.verifyRefreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // почему без авторизации
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(yield composition_root_1.securityQueryRepository.getDevicesForCurrentUser(req.cookies.refreshToken));
}));
exports.securityRouter.delete('/devices', verifyRefreshToken_1.verifyRefreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isTerminated = yield composition_root_1.jwtService.terminateAllDeviceSessions(req.cookies.refreshToken);
    if (!isTerminated) {
        //какую ошибку
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
}));
exports.securityRouter.delete('/devices/:deviceId', verifyRefreshToken_1.verifyRefreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isTerminated = yield composition_root_1.jwtService.terminateSpecifiedDeviceSessions(req.params.deviceId, req.cookies.refreshToken);
    if (isTerminated === false) {
        // принимать объект
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.NOT_FOUND_404);
    }
    if (isTerminated === null) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.FORBIDDEN_403);
    }
    return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
}));
