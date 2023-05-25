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
exports.loginRouter = void 0;
const express_1 = require("express");
const Login_1 = require("../validation/Login");
const validation_errors_handler_1 = require("../middlewares/validation-errors-handler");
const loginService_1 = require("../domain/loginService");
const jwtService_1 = require("../application/jwtService");
const jwtAuth_1 = require("../middlewares/jwtAuth");
exports.loginRouter = (0, express_1.Router)({});
exports.loginRouter.post('/login', Login_1.validateLogin, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield loginService_1.loginService.login(req.body);
    if (user !== null) {
        const token = yield jwtService_1.jwtService.createJWT(user);
        res.status(200).send({ accessToken: token });
    }
    else {
        res.sendStatus(401);
    }
}));
exports.loginRouter.get('/me', jwtAuth_1.authMiddleware, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const result = {
        email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        login: (_b = req.user) === null || _b === void 0 ? void 0 : _b.login,
        userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id
    };
    return res.status(200).send(result);
}));
