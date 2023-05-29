"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfirmationCode = void 0;
const express_validator_1 = require("express-validator");
exports.validateConfirmationCode = [
    (0, express_validator_1.body)('login').notEmpty().isString()
];
