"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const inversify_1 = require("inversify");
const emailAdapter_1 = require("../adapters/emailAdapter");
let EmailService = exports.EmailService = class EmailService {
    constructor(emailAdapter) {
        this.emailAdapter = emailAdapter;
    }
    sendRegistrationConfirmationEmail(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = `<a href='https://incubator-homework-1jd6.vercel.app/confirm-email?code=${code}'>complete registration</a>`;
            const subject = 'registration';
            return yield this.emailAdapter.sendEmail(email, html, subject);
        });
    }
    sendPasswordRecoverEmail(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = `<a href='https://incubator-homework-1jd6.vercel.app/password-recovery?recoveryCode=${code}'>recovery password</a>`;
            const subject = 'password recovery';
            return yield this.emailAdapter.sendEmail(email, html, subject);
        });
    }
};
exports.EmailService = EmailService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [emailAdapter_1.EmailAdapter])
], EmailService);
