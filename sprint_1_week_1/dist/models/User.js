"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class User {
    constructor(id, login, password, passwordSalt, email, createdAt, confirmationEmail, confirmationPassword) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.passwordSalt = passwordSalt;
        this.email = email;
        this.createdAt = createdAt;
        this.confirmationEmail = confirmationEmail;
        this.confirmationPassword = confirmationPassword;
    }
}
exports.User = User;
const UserSchema = new mongoose_1.default.Schema({
    id: { type: String, require: true },
    login: { type: String, require: true },
    password: { type: String, require: true },
    passwordSalt: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    confirmationEmail: {
        confirmationCode: { type: String, require: true },
        expirationDate: { type: Date, require: true },
        isConfirmed: { type: String, require: true }
    },
    confirmationPassword: {
        confirmationCode: { type: String, require: true },
        expirationDate: { type: Date, require: true },
    }
});
exports.UserModel = mongoose_1.default.model('Users', UserSchema);
// export const UserModel = getModelForClass(User)
