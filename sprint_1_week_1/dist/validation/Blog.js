"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlog = void 0;
const express_validator_1 = require("express-validator");
exports.validateBlog = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 1, max: 15 }),
    (0, express_validator_1.body)('description').trim().isLength({ min: 1, max: 500 }),
    (0, express_validator_1.body)('websiteUrl').isLength({ min: 1, max: 100 }).isURL().matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
];
