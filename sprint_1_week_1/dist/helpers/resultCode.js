"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultCode = void 0;
var ResultCode;
(function (ResultCode) {
    ResultCode[ResultCode["Success"] = 0] = "Success";
    ResultCode[ResultCode["NotFound"] = 1] = "NotFound";
    ResultCode[ResultCode["ServerError"] = 2] = "ServerError";
    ResultCode[ResultCode["Forbidden"] = 3] = "Forbidden";
    ResultCode[ResultCode["NoContent"] = 4] = "NoContent";
})(ResultCode || (exports.ResultCode = ResultCode = {}));
