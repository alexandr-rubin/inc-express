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
exports.securityRepository = void 0;
const db_1 = require("../repositories/db");
exports.securityRepository = {
    terminateAllDeviceSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isTerminated = (yield db_1.refreshTokensCollection.deleteMany({ userId: userId, deviceId: { $ne: deviceId } })).acknowledged;
            return isTerminated;
        });
    },
    terminateSpecifiedDeviceSessions(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // возвращать объект как в комментах
            const device = yield db_1.refreshTokensCollection.findOne({ deviceId: deviceId });
            if (!device) {
                return false;
            }
            if (device.userId !== userId) {
                return null;
            }
            const isTerminated = (yield db_1.refreshTokensCollection.deleteOne({ deviceId: deviceId })).acknowledged;
            return isTerminated;
        });
    },
};
