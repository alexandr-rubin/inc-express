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
exports.userRepository = void 0;
const db_1 = require("./db");
const pagination_1 = require("../helpers/pagination");
const date_fns_1 = require("date-fns");
exports.userRepository = {
    getUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const users = yield db_1.usersCollection.find({ $or: searchTermsArray.length === 0 ? [{}] : searchTermsArray }, { projection: { _id: false, password: false, passwordSalt: false, confirmationEmail: false } })
                .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
                .skip(skip).limit(query.pageSize)
                .toArray();
            const count = yield db_1.usersCollection.countDocuments({ $or: searchTermsArray.length === 0 ? [{}] : searchTermsArray });
            const result = (0, pagination_1.createPaginationResult)(count, query, users);
            return result;
        });
    },
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield db_1.usersCollection.insertOne(user)).acknowledged === true;
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    testingDeleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            db_1.usersCollection.deleteMany({});
        });
    },
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ email: email });
            return user;
        });
    },
    getUserBylogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ login: login });
            return user;
        });
    },
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = db_1.usersCollection.findOne({ 'confirmationEmail.confirmationCode': code });
            return user;
        });
    },
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.usersCollection.updateOne({ id }, { $set: { 'confirmationEmail.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    },
    updateConfirmationCode(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.usersCollection.updateOne({ id }, { $set: { 'confirmationEmail.confirmationCode': code, 'confirmationEmail.expirationDate': (0, date_fns_1.add)(new Date(), { hours: 1, minutes: 3 }) } });
            return result.modifiedCount === 1;
        });
    }
};
