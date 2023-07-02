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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const User_1 = require("../models/User");
const authorizationRepository_1 = require("../repositories/authorizationRepository");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService_1 = require("./userService");
const userRepository_1 = require("../repositories/userRepository");
const emailService_1 = require("./emailService");
const mongodb_1 = require("mongodb");
const userQuertyRepository_1 = require("../queryRepositories/userQuertyRepository");
const inversify_1 = require("inversify");
let AuthorizationService = exports.AuthorizationService = class AuthorizationService {
    constructor(emailService, userService, authorizationRepository, userRepository, userQueryRepository) {
        this.emailService = emailService;
        this.userService = userService;
        this.authorizationRepository = authorizationRepository;
        this.userRepository = userRepository;
        this.userQueryRepository = userQueryRepository;
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const login = {
                loginOrEmail: body.loginOrEmail,
                password: body.password
            };
            return this.authorizationRepository.login(login);
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const passSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this.userService._generateHash(user.password, passSalt);
            const newUser = new User_1.User(new mongodb_1.ObjectId().toString(), user.login, passwordHash, passSalt, user.email, new Date().toISOString(), {
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, date_fns_1.add)(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }, {
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, date_fns_1.add)(new Date(), {
                    hours: 1,
                    minutes: 3
                })
            });
            const createResult = yield this.userRepository.addUser(newUser);
            yield this.emailService.sendRegistrationConfirmationEmail(newUser.email, newUser.confirmationEmail.confirmationCode);
            return createResult;
        });
    }
    confrmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQueryRepository.findUserByConfirmationCode(code);
            if (!user)
                return false;
            if (user.confirmationEmail.isConfirmed)
                return false;
            if (user.confirmationEmail.expirationDate < new Date()) {
                return false;
            }
            const isUpdated = yield this.userRepository.updateConfirmation(user.id);
            return isUpdated;
        });
    }
    resendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQueryRepository.getUserByEmail(email);
            if (!user)
                return false;
            if (user.confirmationEmail.isConfirmed === false)
                return false;
            if (user.confirmationEmail.expirationDate < new Date()) {
                return false;
            }
            console.log(user);
            const code = (0, uuid_1.v4)();
            const isUpdated = yield this.userRepository.updateConfirmationCode(user.id, code);
            if (!isUpdated) {
                return false;
            }
            yield this.emailService.sendRegistrationConfirmationEmail(email, code);
            return true;
        });
    }
    recoverPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQueryRepository.getUserByEmail(email);
            if (!user) {
                return null;
            }
            const code = (0, uuid_1.v4)();
            const expirationDate = (0, date_fns_1.add)(new Date(), {
                hours: 1,
                minutes: 3
            });
            const isUpdated = yield this.userRepository.updateconfirmationPasswordData(email, code, expirationDate);
            if (!isUpdated) {
                return false;
            }
            yield this.emailService.sendPasswordRecoverEmail(email, code);
            return true;
        });
    }
    updatePassword(password, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const passSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this.userService._generateHash(password, passSalt);
            const isUpdated = yield this.userRepository.updatePassword(passwordHash, passSalt, code);
            if (!isUpdated) {
                return false;
            }
            return true;
        });
    }
};
exports.AuthorizationService = AuthorizationService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [emailService_1.EmailService, userService_1.UserService, authorizationRepository_1.AuthorizationRepository,
        userRepository_1.UserRepository, userQuertyRepository_1.UserQueryRepository])
], AuthorizationService);
