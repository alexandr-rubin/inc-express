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
const userQuertyRepository_1 = require("../queryRepositories/userQuertyRepository");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const composition_root_1 = require("../composition-root");
const verifyRefreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userQueryRepositoryInst = new userQuertyRepository_1.UserQueryRepository();
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401).send('No refresh token');
    }
    const device = yield composition_root_1.jwtService.getDeviceByToken(token);
    const isCompare = yield composition_root_1.jwtService.compareTokenDate(token);
    if (!device || !device.isValid || !isCompare) {
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401).send('Invalid device');
    }
    const userId = yield composition_root_1.jwtService.getUserIdByToken(token);
    if (userId === null) {
        yield composition_root_1.jwtService.logoutDevice(token);
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401).send('Invalid user');
    }
    const user = yield userQueryRepositoryInst.getUserById(userId);
    if (!user) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    req.user = user;
    return next();
});
exports.verifyRefreshTokenMiddleware = verifyRefreshTokenMiddleware;
