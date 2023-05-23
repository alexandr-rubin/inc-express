"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComment = void 0;
const express_validator_1 = require("express-validator");
exports.validateComment = [
    (0, express_validator_1.body)('content').notEmpty().isString().trim().isLength({ min: 20, max: 300 }),
];
