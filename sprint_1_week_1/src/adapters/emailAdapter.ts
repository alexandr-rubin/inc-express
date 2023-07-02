import { injectable } from "inversify";
import { createTransport, getTestMessageUrl } from "nodemailer";

@injectable()
export class EmailAdapter {
    async sendEmail(email: string, html: string, subject: string) {
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
                subject: subject,
                html: html,
            });
        
            console.log("Message sent: %s", info.messageId);
        
            return info
    }
}