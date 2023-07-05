"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = exports.PostSchema = exports.PostViewModel = exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// export type Post = {
//     id: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string,
//     createdAt: string
// }
class Post {
    constructor(id, title, shortDescription, content, blogId, blogName, createdAt, extendedLikesInfo) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.extendedLikesInfo = extendedLikesInfo;
    }
}
exports.Post = Post;
class PostViewModel {
    constructor(id, title, shortDescription, content, blogId, blogName, createdAt, extendedLikesInfo) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.extendedLikesInfo = extendedLikesInfo;
    }
}
exports.PostViewModel = PostViewModel;
exports.PostSchema = new mongoose_1.default.Schema({
    id: { type: String, require: true },
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true },
    extendedLikesInfo: { likesCount: { type: Number, require: true }, dislikesCount: { type: Number, require: true } }
}, { versionKey: false });
exports.PostModel = mongoose_1.default.model('Posts', exports.PostSchema);
