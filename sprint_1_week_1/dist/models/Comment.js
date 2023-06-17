"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.CommentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CommentSchema = new mongoose_1.default.Schema({
    id: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true }
    },
    createdAt: { type: String, require: true },
    postId: { type: String, require: true }
});
exports.CommentModel = mongoose_1.default.model('Comments', exports.CommentSchema);
