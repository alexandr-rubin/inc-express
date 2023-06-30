"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.CommentSchema = exports.Comment = exports.CommentViewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// export type Comment ={
//     id: string,
//     content: string,
//     commentatorInfo: {
//         userId: string,
//         userLogin: string
//     },
//     createdAt: string,
//     postId: string
// }
class CommentViewModel {
    constructor(id, content, commentatorInfo, createdAt, likesInfo) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
    }
}
exports.CommentViewModel = CommentViewModel;
class Comment {
    constructor(id, content, commentatorInfo, createdAt, postId, likesInfo) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.postId = postId;
        this.likesInfo = likesInfo;
    }
}
exports.Comment = Comment;
exports.CommentSchema = new mongoose_1.default.Schema({
    id: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true }
    },
    createdAt: { type: String, require: true },
    postId: { type: String, require: true },
    likesInfo: { likesCount: { type: Number, require: true }, dislikesCount: { type: Number, require: true } }
}, { versionKey: false });
exports.CommentModel = mongoose_1.default.model('Comments', exports.CommentSchema);
