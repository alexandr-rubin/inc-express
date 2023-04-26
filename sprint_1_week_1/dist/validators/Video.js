"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const validator = (video) => {
    if (typeof video.title !== 'string') {
        return createError('Title must be a string', 'title');
    }
    else {
        return {};
    }
};
exports.validator = validator;
function createError(message, field) {
    return {
        errorMessage: [{
                message: message,
                field: field
            }]
    };
}
