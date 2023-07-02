import { injectable } from "inversify"
import { EmailAdapter } from "../adapters/emailAdapter"

@injectable()
export class EmailService {
    constructor(protected emailAdapter: EmailAdapter){}    
    async sendRegistrationConfirmationEmail(email: string, code: string){
        const html = `<a href='https://incubator-homework-1jd6.vercel.app/confirm-email?code=${code}'>complete registration</a>`
        const subject = 'registration'
        return await this.emailAdapter.sendEmail(email, html, subject)
    }
    async sendPasswordRecoverEmail(email: string, code: string){
        const html = `<a href='https://incubator-homework-1jd6.vercel.app/password-recovery?recoveryCode=${code}'>recovery password</a>`
        const subject = 'password recovery'
        return await this.emailAdapter.sendEmail(email, html, subject)
    }
}