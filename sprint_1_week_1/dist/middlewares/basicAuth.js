"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const basicAuthMiddleware = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization === 'Basic YWRtaW46cXdlcnR5') {
        return next();
    }
    else {
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED_401).json({ message: "Unauthorized" });
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
