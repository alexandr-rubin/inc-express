"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.EmailAdapter = void 0;
const inversify_1 = require("inversify");
const nodemailer_1 = require("nodemailer");
let EmailAdapter = exports.EmailAdapter = class EmailAdapter {
    sendEmail(email, html, subject) {
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
                subject: subject,
                html: html,
            });
            console.log("Message sent: %s", info.messageId);
            return info;
        });
    }
};
exports.EmailAdapter = EmailAdapter = __decorate([
    (0, inversify_1.injectable)()
], EmailAdapter);
