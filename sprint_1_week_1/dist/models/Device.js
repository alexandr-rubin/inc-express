"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModel = exports.DeviceSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.DeviceSchema = new mongoose_1.default.Schema({
    issuedAt: { type: String, require: true },
    expirationDate: { type: String, require: true },
    IP: { type: String, require: true },
    deviceName: { type: String, require: true },
    deviceId: { type: String, require: true },
    userId: { type: String, require: true },
    isValid: { type: Boolean, require: true }
});
exports.DeviceModel = mongoose_1.default.model('Devices', exports.DeviceSchema);
