"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAPIModel = exports.APILogSchema = exports.APILog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// export type APILog = {
//     IP: string,
//     URL: string,
//     date: string
// }
class APILog {
    constructor(IP, URL, date) {
        this.IP = IP;
        this.URL = URL;
        this.date = date;
    }
}
exports.APILog = APILog;
exports.APILogSchema = new mongoose_1.default.Schema({
    IP: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: String, require: true }
});
exports.LogAPIModel = mongoose_1.default.model('APILogs', exports.APILogSchema);
