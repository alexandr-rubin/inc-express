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
const authorizationService_1 = require("../domain/authorizationService");
const jwtService_1 = require("../application/jwtService");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const User_1 = require("../validation/User");
const Email_1 = require("../validation/Email");
const ConfirmationCode_1 = require("../validation/ConfirmationCode");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
exports.authorizationRouterRouter = (0, express_1.Router)({});
exports.authorizationRouterRouter.post('/login', Login_1.validateLogin, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authorizationService_1.authorizationService.login(req.body);
    if (!user) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401);
    }
    const token = yield jwtService_1.jwtService.createJWT(user);
    return res.status(httpStatusCode_1.HttpStatusCode.OK_200).send({ accessToken: token });
}));
// !!0, 
exports.authorizationRouterRouter.get('/me', jwtAuth_1.authMiddleware, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.authorizationRouterRouter.post('/registration', User_1.validateUser, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isCreated = authorizationService_1.authorizationService.createUser(req.body);
    if (!isCreated) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address');
}));
exports.authorizationRouterRouter.post('/registration-confirmation', ConfirmationCode_1.validateConfirmationCode, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfirmed = yield authorizationService_1.authorizationService.confrmEmail(req.body.code);
    if (!isConfirmed) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('Email was verified. Account was activated');
}));
exports.authorizationRouterRouter.post('/registration-email-resending', Email_1.validateEmail, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isResended = yield authorizationService_1.authorizationService.resendEmail(req.body.email);
    if (!isResended) {
        return res.sendStatus(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400);
    }
    return res.status(httpStatusCode_1.HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address');
}));
