"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
//import { usersCollection } from './db'
const User_1 = require("../models/User");
const date_fns_1 = require("date-fns");
let UserRepository = exports.UserRepository = class UserRepository {
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User_1.UserModel.insertMany([user]);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.UserModel.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
    testingDeleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.UserModel.deleteMany({});
        });
    }
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield User_1.UserModel.updateOne({ id: id }, { $set: { 'confirmationEmail.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    }
    updateConfirmationCode(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield User_1.UserModel.updateOne({ id: id }, { $set: { 'confirmationEmail.confirmationCode': code, 'confirmationEmail.expirationDate': (0, date_fns_1.add)(new Date(), { hours: 1, minutes: 3 }) } });
            return result.modifiedCount === 1;
        });
    }
    updateconfirmationPasswordData(email, code, expirationDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield User_1.UserModel.updateOne({ email: email }, { $set: { 'confirmationPassword.confirmationCode': code, 'confirmationPassword.expirationDate': expirationDate } });
            return result.modifiedCount === 1;
        });
    }
    updatePassword(password, salt, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.UserModel.updateOne({ 'confirmationPassword.confirmationCode': code }, { $set: { password: password, passwordSalt: salt } });
            return result.modifiedCount === 1;
        });
    }
};
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
