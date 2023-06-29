"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = exports.BlogSchema = exports.Blog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// export type Blog ={
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//     createdAt: string,
//     isMembership: boolean
//   }
class Blog {
    constructor(id, name, description, websiteUrl, createdAt, isMembership) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
    }
}
exports.Blog = Blog;
exports.BlogSchema = new mongoose_1.default.Schema({
    id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
});
exports.BlogModel = mongoose_1.default.model('Blogs', exports.BlogSchema);
