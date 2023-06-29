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
exports.UserQueryRepository = void 0;
//import { usersCollection } from '../repositories/db'
const User_1 = require("../models/User");
const pagination_1 = require("../helpers/pagination");
class UserQueryRepository {
    getUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, pagination_1.createPaginationQuery)(req);
            const skip = (query.pageNumber - 1) * query.pageSize;
            // fix any
            const search = {};
            if (query.searchLoginTerm != null) {
                search.login = { $regex: query.searchLoginTerm, $options: 'i' };
            }
            if (query.searchEmailTerm != null) {
                search.email = { $regex: query.searchEmailTerm, $options: 'i' };
            }
            const searchTermsArray = Object.keys(search).map(key => ({ [key]: search[key] }));
            const users = yield User_1.UserModel.find({ $or: searchTermsArray.length === 0 ? [{}] : searchTermsArray }, { projection: { _id: false, password: false, passwordSalt: false, confirmationEmail: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize).lean();
            const count = yield User_1.UserModel.countDocuments({ $or: searchTermsArray.length === 0 ? [{}] : searchTermsArray });
            const result = (0, pagination_1.createPaginationResult)(count, query, users);
            return result;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ email: email });
            return user;
        });
    }
    getUserBylogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ login: login });
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ id: id });
            return user;
        });
    }
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ 'confirmationEmail.confirmationCode': code });
            return user;
        });
    }
    findUserByConfirmationPasswordCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ 'confirmationPassword.confirmationCode': code });
            return user;
        });
    }
}
exports.UserQueryRepository = UserQueryRepository;
