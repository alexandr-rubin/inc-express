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
const date_fns_1 = require("date-fns");
exports.userRepository = {
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
