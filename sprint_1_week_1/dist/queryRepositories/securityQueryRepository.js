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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityQueryRepository = void 0;
const jwtService_1 = require("../application/jwtService");
//import { refreshTokensCollection } from '../repositories/db'
const Device_1 = require("../models/Device");
const inversify_1 = require("inversify");
let SecurityQueryRepository = exports.SecurityQueryRepository = class SecurityQueryRepository {
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
};
exports.SecurityQueryRepository = SecurityQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [jwtService_1.JWTService])
], SecurityQueryRepository);
