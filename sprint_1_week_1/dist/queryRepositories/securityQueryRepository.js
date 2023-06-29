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
exports.SecurityQueryRepository = void 0;
//import { refreshTokensCollection } from '../repositories/db'
const Device_1 = require("../models/Device");
class SecurityQueryRepository {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    getDevicesForCurrentUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.jwtService.getUserIdByToken(token);
            const devices = yield Device_1.DeviceModel.find({ userId: userId, isValid: true }).lean();
            const result = devices.map(device => { return { deviceId: device.deviceId, ip: device.IP, lastActiveDate: device.issuedAt, title: device.deviceName }; });
            return result;
        });
    }
}
exports.SecurityQueryRepository = SecurityQueryRepository;
