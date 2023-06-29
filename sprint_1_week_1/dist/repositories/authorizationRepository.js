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
exports.AuthorizationRepository = void 0;
//import { refreshTokensCollection, usersCollection } from './db'
const User_1 = require("../models/User");
const Device_1 = require("../models/Device");
class AuthorizationRepository {
    constructor(userService) {
        this.userService = userService;
    }
    login(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ $or: [{ login: login.loginOrEmail }, { email: login.loginOrEmail }] });
            if (user) {
                const password = yield this.userService._generateHash(login.password, user.passwordSalt);
                if (user.password === password) {
                    return user;
                }
            }
            return null;
        });
    }
    addDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Device_1.DeviceModel.insertMany([device]);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    updateDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = (yield Device_1.DeviceModel.updateOne(device)).acknowledged;
            return isUpdated;
        });
    }
    logoutDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield Device_1.DeviceModel.updateOne({ deviceId: deviceId }, { $set: { isValid: false } });
            return isUpdated.acknowledged;
        });
    }
    getDeviceByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield Device_1.DeviceModel.findOne({ deviceId: deviceId });
            return device;
        });
    }
    testingDeleteAllDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Device_1.DeviceModel.deleteMany({});
        });
    }
}
exports.AuthorizationRepository = AuthorizationRepository;
