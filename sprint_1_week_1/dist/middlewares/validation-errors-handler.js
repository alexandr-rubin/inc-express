"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorsHandler = void 0;
const express_validator_1 = require("express-validator");
const httpStatusCode_1 = require("../helpers/httpStatusCode");
const validationErrorsHandler = (req, res, next) => {
    const errorsMessages = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true }).map(error => ({ message: error.msg, field: error.type === 'field' ? error.path : error.type }));
    //const error = validationResult(req).array()
    if (errorsMessages.length) {
        res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST_400).json({ errorsMessages });
    }
    else {
        next();
    }
};
exports.validationErrorsHandler = validationErrorsHandler;
