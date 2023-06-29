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
exports.validateConfirmationEmail = void 0;
const express_validator_1 = require("express-validator");
const userQuertyRepository_1 = require("../queryRepositories/userQuertyRepository");
const userQueryRepositoryInst = new userQuertyRepository_1.UserQueryRepository();
exports.validateConfirmationEmail = [
    (0, express_validator_1.body)('email').notEmpty().isString().isEmail().custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userQueryRepositoryInst.getUserByEmail(email);
        if (!user) {
            throw new Error('Wrong email');
        }
        if (user.confirmationEmail.isConfirmed === true) {
            throw new Error('User wit email: ' + user.email + ' is already confirmed');
        }
    }))
];
