"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
exports.validateLogin = [
    (0, express_validator_1.body)('loginOrEmail').notEmpty().isString().trim().isLength({ min: 3, max: 256 }),
    (0, express_validator_1.body)('password').notEmpty().isString().trim().isLength({ min: 6, max: 20 })
];
