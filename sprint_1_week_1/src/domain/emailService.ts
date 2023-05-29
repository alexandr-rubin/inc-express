import { emailAdapter } from "../adapters/emailAdapter"

export const emailService = {
    async sendEmail(email: string, code: string){
        return await emailAdapter.sendEmail(email, code)
    }
}