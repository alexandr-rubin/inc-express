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
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Device_1 = require("../models/Device");
const uuid_1 = require("uuid");
const secretKey = process.env.JWT_SECRET_KEY || '123';
class JWTService {
    constructor(authorizationRepository, securityRepository) {
        this.authorizationRepository = authorizationRepository;
        this.securityRepository = securityRepository;
    }
    createJWT(user, deviceId, issuedAt) {
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: '10m' });
        const refreshToken = jsonwebtoken_1.default.sign({ deviceId: deviceId, userId: user.id, issuedAt: issuedAt }, secretKey, { expiresIn: '20m' });
        const result = { accessToken: accessToken, refreshToken: refreshToken };
        return result;
    }
    // убрать дублирование при создании и обновлении девайса
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
            const device = new Device_1.Device(issuedAt, expirationDate.toISOString(), clientIP, userAgent, deviceId, decodedToken.userId, true);
            const isAdded = yield this.authorizationRepository.addDevice(device);
            if (!isAdded) {
                return null;
            }
            return tokens;
        });
    }
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
                const newDevice = new Device_1.Device(issuedAt, expirationDate.toISOString(), clientIP, userAgent, deviceId, decodedNewToken.userId, true);
                const isUpdated = yield this.authorizationRepository.updateDevice(newDevice);
                if (!isUpdated) {
                    return null;
                }
                return tokens;
            }
            catch (err) {
                return null;
            }
        });
    }
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
    }
    // add device service
    logoutDevice(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(refreshToken, secretKey);
                const isLogedout = yield this.authorizationRepository.logoutDevice(decodedToken.deviceId);
                return isLogedout;
            }
            catch (_a) {
                return false;
            }
        });
    }
    getDeviceByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
                const device = yield this.authorizationRepository.getDeviceByDeviceId(decodedToken.deviceId);
                return device;
            }
            catch (err) {
                return null;
            }
        });
    }
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
    }
    terminateAllDeviceSessions(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
                const isTerminated = yield this.securityRepository.terminateAllDeviceSessions(decodedToken.userId, decodedToken.deviceId);
                return isTerminated;
            }
            catch (err) {
                return false;
            }
        });
    }
    terminateSpecifiedDeviceSessions(deviceId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: вернуть объект вместо null
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
                // if(decodedToken.userId !== userId){
                //     return null
                // }
                const isTerminated = yield this.securityRepository.terminateSpecifiedDeviceSessions(deviceId, decodedToken.userId);
                return isTerminated;
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.JWTService = JWTService;
