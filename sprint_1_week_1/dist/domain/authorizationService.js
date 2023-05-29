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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationService = void 0;
const authorizationRepository_1 = require("../repositories/authorizationRepository");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService_1 = require("./userService");
const userRepository_1 = require("../repositories/userRepository");
const emailService_1 = require("./emailService");
const mongodb_1 = require("mongodb");
exports.authorizationService = {
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const login = {
                loginOrEmail: body.loginOrEmail,
                password: body.password
            };
            return authorizationRepository_1.authorizationRepository.login(login);
        });
    },
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const passSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield userService_1.userService._generateHash(user.password, passSalt);
            const newUser = {
                id: new mongodb_1.ObjectId().toString(),
                login: user.login,
                password: passwordHash,
                passwordSalt: passSalt,
                email: user.email,
                createdAt: new Date().toISOString(),
                confirmationEmail: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: false
                }
            };
            const createResult = yield userRepository_1.userRepository.addUser(newUser);
            yield emailService_1.emailService.sendEmail(newUser.email, newUser.confirmationEmail.confirmationCode);
            return createResult;
        });
    },
    confrmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.userRepository.findUserByConfirmationCode(code);
            if (!user)
                return false;
            if (user.confirmationEmail.isConfirmed)
                return false;
            if (user.confirmationEmail.expirationDate < new Date()) {
                return false;
            }
            const result = yield userRepository_1.userRepository.updateConfirmation(user.id);
            return result;
        });
    },
    resendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.userRepository.getUserByEmail(email);
            if (!user)
                return false;
            if (user.confirmationEmail.isConfirmed)
                return false;
            if (user.confirmationEmail.expirationDate < new Date()) {
                return false;
            }
            const code = (0, uuid_1.v4)();
            yield userRepository_1.userRepository.updateConfirmationCode(user.id, code);
            yield emailService_1.emailService.sendEmail(email, code);
            return true;
        });
    }
};
