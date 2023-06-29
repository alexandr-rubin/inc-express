"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModel = exports.DeviceSchema = exports.Device = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// export type Device = {
//     issuedAt: string,
//     expirationDate: string,
//     IP: string,
//     deviceName: string,
//     deviceId: string,
//     userId: string,
//     isValid: boolean
// }
class Device {
    constructor(issuedAt, expirationDate, IP, deviceName, deviceId, userId, isValid) {
        this.issuedAt = issuedAt;
        this.expirationDate = expirationDate;
        this.IP = IP;
        this.deviceName = deviceName;
        this.deviceId = deviceId;
        this.userId = userId;
        this.isValid = isValid;
    }
}
exports.Device = Device;
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
