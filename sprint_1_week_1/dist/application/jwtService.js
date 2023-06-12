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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizationRepository_1 = require("../repositories/authorizationRepository");
const uuid_1 = require("uuid");
const securityRepository_1 = require("../repositories/securityRepository");
const secretKey = process.env.JWT_SECRET_KEY || '123';
exports.jwtService = {
    createJWT(user, deviceId, issuedAt) {
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: '10s' });
        const refreshToken = jsonwebtoken_1.default.sign({ deviceId: deviceId, userId: user.id, issuedAt: issuedAt }, secretKey, { expiresIn: '20s' });
        const result = { accessToken: accessToken, refreshToken: refreshToken };
        return result;
    },
    addDevice(user, userAgent, clientIP) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userAgent) {
                userAgent = 'default device name';
            }
            const deviceId = (0, uuid_1.v4)();
            const issuedAt = new Date().toISOString();
            const tokens = this.createJWT(user, deviceId, issuedAt);
            const decodedToken = jsonwebtoken_1.default.verify(tokens.refreshToken, secretKey);
            const expirationDate = new Date(decodedToken.exp * 1000);
            const device = {
                issuedAt: issuedAt,
                expirationDate: expirationDate.toISOString(),
                IP: clientIP,
                deviceName: userAgent,
                deviceId: deviceId,
                userId: decodedToken.userId,
                isValid: true
            };
            const isAdded = yield authorizationRepository_1.authorizationRepository.addDevice(device);
            if (!isAdded) {
                return null;
            }
            return tokens;
        });
    },
    updateDevice(refreshToken, clientIP, userAgent, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(refreshToken, secretKey);
                if (!userAgent) {
                    userAgent = 'default device name';
                }
                const deviceId = decodedToken.deviceId;
                const issuedAt = new Date().toISOString();
                const tokens = this.createJWT(user, deviceId, issuedAt);
                const decodedNewToken = jsonwebtoken_1.default.verify(tokens.refreshToken, secretKey);
                const expirationDate = new Date(decodedNewToken.exp * 1000);
                const newDevice = {
                    issuedAt: issuedAt,
                    expirationDate: expirationDate.toISOString(),
                    IP: clientIP,
                    deviceName: userAgent,
                    deviceId: deviceId,
                    userId: decodedNewToken.userId,
                    isValid: true
                };
                const isUpdated = yield authorizationRepository_1.authorizationRepository.updateDevice(newDevice);
                if (!isUpdated) {
                    return null;
                }
                return tokens;
            }
            catch (err) {
                return null;
            }
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, secretKey);
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    },
    logoutDevice(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(refreshToken, secretKey);
                const isLogedout = yield authorizationRepository_1.authorizationRepository.logoutDevice(decodedToken.deviceId);
                return isLogedout;
            }
            catch (_a) {
                return false;
            }
        });
    },
    getDeviceByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
                const device = yield authorizationRepository_1.authorizationRepository.getDeviceByDeviceId(decodedToken.deviceId);
                return device;
            }
            catch (err) {
                return null;
            }
        });
    },
    compareTokenDate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
                const device = yield this.getDeviceByToken(token);
                if (!device || decodedToken.issuedAt !== device.issuedAt) {
                    return false;
                }
                return true;
            }
            catch (err) {
                return false;
            }
        });
    },
    terminateAllDeviceSessions(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
                const isTerminated = yield securityRepository_1.securityRepository.terminateAllDeviceSessions(decodedToken.userId, decodedToken.deviceId);
                return isTerminated;
            }
            catch (err) {
                return false;
            }
        });
    },
    terminateSpecifiedDeviceSessions(deviceId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: вернуть объект вместо null
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
                // if(decodedToken.userId !== userId){
                //     return null
                // }
                const isTerminated = yield securityRepository_1.securityRepository.terminateSpecifiedDeviceSessions(deviceId, decodedToken.userId);
                return isTerminated;
            }
            catch (err) {
                return false;
            }
        });
    }
};
