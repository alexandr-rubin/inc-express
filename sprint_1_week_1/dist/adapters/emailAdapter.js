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
exports.emailAdapter = void 0;
const nodemailer_1 = require("nodemailer");
exports.emailAdapter = {
    sendEmail(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = (0, nodemailer_1.createTransport)({
                service: 'gmail',
                auth: {
                    user: 'rubinyourhead@gmail.com',
                    pass: 'kixbxpkqgkdbabte',
                },
            });
            let info = yield transporter.sendMail({
                from: 'homework <rubinyourhead@gmail.com>',
                to: email,
                subject: 'registration',
                html: `<a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>`,
            });
            console.log("Message sent: %s", info.messageId);
            return info;
        });
    }
};
