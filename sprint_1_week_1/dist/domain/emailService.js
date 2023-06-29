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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
class EmailService {
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
}
exports.EmailService = EmailService;
