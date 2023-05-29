"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
exports.validateEmail = [
    (0, express_validator_1.body)('email').notEmpty().isString().isEmail()
];
