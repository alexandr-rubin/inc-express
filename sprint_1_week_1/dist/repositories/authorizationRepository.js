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
exports.authorizationRepository = void 0;
const db_1 = require("./db");
const userService_1 = require("../domain/userService");
exports.authorizationRepository = {
    login(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ $or: [{ login: login.loginOrEmail }, { email: login.loginOrEmail }] });
            if (user) {
                const password = yield userService_1.userService._generateHash(login.password, user.passwordSalt);
                if (user.password === password) {
                    return user;
                }
            }
            return null;
        });
    },
    addDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdded = (yield db_1.refreshTokensCollection.insertOne(device)).acknowledged;
            return isAdded;
        });
    },
    updateDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = (yield db_1.refreshTokensCollection.updateOne({ deviceId: device.deviceId }, { $set: {
                    issuedAt: device.issuedAt,
                    expirationDate: device.expirationDate,
                    IP: device.IP,
                    deviceName: device.deviceName,
                    deviceId: device.deviceId,
                    userId: device.userId
                } })).acknowledged;
            return isUpdated;
        });
    },
    logoutDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield db_1.refreshTokensCollection.updateOne({ deviceId: deviceId }, { $set: { isValid: false } });
            return isUpdated.acknowledged;
        });
    },
    getDeviceByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield db_1.refreshTokensCollection.findOne({ deviceId: deviceId });
            return device;
        });
    },
    testingDeleteAllDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.refreshTokensCollection.deleteMany({});
            return result.acknowledged;
        });
    }
};
