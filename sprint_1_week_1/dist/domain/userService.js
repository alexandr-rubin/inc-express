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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const mongodb_1 = require("mongodb");
const userRepository_1 = require("../repositories/userRepository");
const pagination_1 = require("../helpers/pagination");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
exports.userService = {
    getUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userQuery = (0, pagination_1.createPaginationQuery)(req);
            return yield userRepository_1.userRepository.getUsers(userQuery);
        });
    },
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const passSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(user.password, passSalt);
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
                    isConfirmed: true
                }
            };
            const { password, passwordSalt, confirmationEmail } = newUser, result = __rest(newUser, ["password", "passwordSalt", "confirmationEmail"]);
            yield userRepository_1.userRepository.addUser(newUser);
            return result;
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userRepository_1.userRepository.deleteUserById(id);
        });
    },
    testingDeleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            userRepository_1.userRepository.testingDeleteAllUsers();
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            console.log('hash: ' + hash);
            return hash;
        });
    }
};
