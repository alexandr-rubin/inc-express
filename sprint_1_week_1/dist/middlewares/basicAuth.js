"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const basicAuthMiddleware = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization === 'Basic YWRtaW46cXdlcnR5' || req.method === 'GET') {
        return next();
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
