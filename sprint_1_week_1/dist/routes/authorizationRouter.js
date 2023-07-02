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
exports.authorizationRouterRouter = void 0;
const express_1 = require("express");
const Login_1 = require("../validation/Login");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const User_1 = require("../validation/User");
const ConfirmationCode_1 = require("../validation/ConfirmationCode");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const verifyRefreshToken_1 = require("../middlewares/verifyRefreshToken");
const logAPI_1 = require("../middlewares/logAPI");
const EmailResending_1 = require("../validation/EmailResending");
const Email_1 = require("../validation/Email");
const RecoveryPassword_1 = require("../validation/RecoveryPassword");
const composition_root_1 = require("../composition-root");
const authorizationService_1 = require("../domain/authorizationService");
const jwtService_1 = require("../application/jwtService");
const authorizationService = composition_root_1.container.resolve(authorizationService_1.AuthorizationService);
const jwtService = composition_root_1.container.resolve(jwtService_1.JWTService);
exports.authorizationRouterRouter = (0, express_1.Router)({});
exports.authorizationRouterRouter.post('/login', logAPI_1.logAPIMiddleware, Login_1.validateLogin, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authorizationService.login(req.body);
    if (!user) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401);
    }
    const userAgent = req.headers['user-agent'];
    const clientIP = req.ip;
    const tokens = yield jwtService.addDevice(user, userAgent, clientIP);
    if (!tokens) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send({ accessToken: tokens.accessToken });
}));
exports.authorizationRouterRouter.post('/refresh-token', logAPI_1.logAPIMiddleware, verifyRefreshToken_1.verifyRefreshTokenMiddleware, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const oldToken = req.cookies.refreshToken;
    const userAgent = req.headers['user-agent'];
    const clientIP = req.ip;
    const tokens = yield jwtService.updateDevice(oldToken, clientIP, userAgent, user);
    if (!tokens) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send({ accessToken: tokens.accessToken });
}));
exports.authorizationRouterRouter.post('/logout', logAPI_1.logAPIMiddleware, verifyRefreshToken_1.verifyRefreshTokenMiddleware, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oldToken = req.cookies.refreshToken;
    const isUpdated = yield jwtService.logoutDevice(oldToken);
    if (!isUpdated) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
}));
// !!0, 
exports.authorizationRouterRouter.get('/me', logAPI_1.logAPIMiddleware, jwtAuth_1.authMiddleware, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // ид
    // файд by id
    //
    const result = {
        email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        login: (_b = req.user) === null || _b === void 0 ? void 0 : _b.login,
        userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id
    };
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send(result);
}));
exports.authorizationRouterRouter.post('/registration', logAPI_1.logAPIMiddleware, User_1.validateUser, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isCreated = yield authorizationService.createUser(req.body);
    if (!isCreated) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address');
}));
exports.authorizationRouterRouter.post('/registration-confirmation', logAPI_1.logAPIMiddleware, ConfirmationCode_1.validateConfirmationCode, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfirmed = yield authorizationService.confrmEmail(req.body.code);
    if (!isConfirmed) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('Email was verified. Account was activated');
}));
exports.authorizationRouterRouter.post('/registration-email-resending', logAPI_1.logAPIMiddleware, EmailResending_1.validateConfirmationEmail, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isResended = yield authorizationService.resendEmail(req.body.email);
    if (!isResended) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address');
}));
exports.authorizationRouterRouter.post('/password-recovery', logAPI_1.logAPIMiddleware, Email_1.validateEmail, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isSended = yield authorizationService.recoverPassword(req.body.email);
    if (isSended === null) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
    }
    if (isSended === false) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR_500);
    }
    return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
}));
exports.authorizationRouterRouter.post('/new-password', logAPI_1.logAPIMiddleware, RecoveryPassword_1.validateRecoveryPassword, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield authorizationService.updatePassword(req.body.newPassword, req.body.recoveryCode);
    if (!isUpdated) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR_500);
    }
    return res.sendStatus(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204);
}));
