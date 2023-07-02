"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.UserService = void 0;
const User_1 = require("../models/User");
const mongodb_1 = require("mongodb");
const userRepository_1 = require("../repositories/userRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const inversify_1 = require("inversify");
let UserService = exports.UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const passSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(user.password, passSalt);
            const newUser = new User_1.User(new mongodb_1.ObjectId().toString(), user.login, passwordHash, passSalt, user.email, new Date().toISOString(), {
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, date_fns_1.add)(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: true
            }, {
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, date_fns_1.add)(new Date(), {
                    hours: 1,
                    minutes: 3
                })
            });
            const { password, passwordSalt, confirmationEmail, confirmationPassword } = newUser, result = __rest(newUser, ["password", "passwordSalt", "confirmationEmail", "confirmationPassword"]);
            yield this.userRepository.addUser(newUser);
            return result;
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.deleteUserById(id);
        });
    }
    testingDeleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            this.userRepository.testingDeleteAllUsers();
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            console.log('hash: ' + hash);
            return hash;
        });
    }
};
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [userRepository_1.UserRepository])
], UserService);
