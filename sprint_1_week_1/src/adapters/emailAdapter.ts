import { createTransport, getTestMessageUrl } from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, code: string){
        let transporter = createTransport({
            service: 'gmail',
            auth: {
                user: 'rubinyourhead@gmail.com', 
                pass: 'kixbxpkqgkdbabte',
            },
            });
        
            let info = await transporter.sendMail({
                from: 'homework <rubinyourhead@gmail.com>',
                to: email,
                subject: 'registration',
                html: `<a href='https://incubator-homework-1jd6.vercel.app/confirm-email?code=${code}'>complete registration</a>`,
            });
        
            console.log("Message sent: %s", info.messageId);
        
            return info
    }
}