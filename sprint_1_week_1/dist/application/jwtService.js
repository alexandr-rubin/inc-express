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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizationRepository_1 = require("../repositories/authorizationRepository");
const secretKey = process.env.JWT_SECRET_KEY || '123';
exports.jwtService = {
    createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: '10s' });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: '20s' });
            const token = {
                token: refreshToken,
                isValid: true
            };
            const isAdded = yield authorizationRepository_1.authorizationRepository.addRefreshToken(token);
            if (!isAdded) {
                return null;
            }
            return { accessToken: accessToken, refreshToken: refreshToken };
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, secretKey);
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    }
};
