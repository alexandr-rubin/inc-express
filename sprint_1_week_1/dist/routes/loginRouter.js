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
exports.loginRouter = (0, express_1.Router)({});
exports.loginRouter.post('/login', Login_1.validateLogin, validation_errors_handler_1.validationErrorsHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isLogin = yield loginService_1.loginService.login(req.body);
    if (isLogin)
        return res.sendStatus(204);
    return res.sendStatus(401);
}));
