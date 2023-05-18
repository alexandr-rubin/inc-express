"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
exports.validateUser = [
    (0, express_validator_1.body)('login').notEmpty().isString().trim().isLength({ min: 3, max: 10 }).matches('^[a-zA-Z0-9_-]*$'),
    (0, express_validator_1.body)('password').notEmpty().isString().trim().isLength({ min: 6, max: 20 }),
    (0, express_validator_1.body)('email').notEmpty().isString().isEmail() /*('/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/')*/
];
