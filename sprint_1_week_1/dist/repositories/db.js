"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testDb';
// const client = new MongoClient(MONGODB_URI)
// export const blogsCollection = client.db().collection<Blog>('Blogs')
// export const postsCollection = client.db().collection<Post>('Posts')
// export const usersCollection = client.db().collection<User>('Users')
// export const commentsCollection = client.db().collection<Comment>('Comments')
// export const refreshTokensCollection = client.db().collection<Device>('RefreshTokens')
// export const apiLogsCollection = client.db().collection<APILog>('APILogs')
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log("Connected " + MONGODB_URI);
        }
        catch (_a) {
            console.log('Database connection error');
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDb = runDb;
