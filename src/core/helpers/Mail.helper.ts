import * as nodemailer from "nodemailer";
import * as path from "path";
import * as fs from "fs";

export class MailHelper {
    private transporter;

    constructor(private config: any) {
        //this.transporter = nodemailer.createTransport({
        //    host: config.mail.smtp,
        //    port: config.mail.smtp_port,
        //    secure: true,
        //    auth: {
        //        user: config.mail.user,
        //        pass: config.mail.password
        //    }
        //});

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.config.user,
                pass: this.config.password
            }
        });
    }

    public async sendQuestion(emailFrom, name, question) {
        let mailOptions = {
            from: `${this.config.name} <${this.config.user}>`,
            to: "finapi.fak@gmail.com",
            subject: "QUESTION",
            text: `Question from ${emailFrom}, ${name} : ${question}`
        };

        await this.transporter.sendMail(mailOptions);
    }

    public async sendConfirmation(emailTo, userId) {
        const confirmationLink = `${this.config.server.apiDomain}/api/user/confirmRegistration/${userId}`;
        const pathToFile = path.join(__dirname, "./templates", `confirm_reg_${this.config.telegram.siteName}.html`);
        const htmlFile = fs.readFileSync(pathToFile, {encoding: "utf-8"});

        let mailOptions = {
            from: `${this.config.telegram.siteName} <${this.config.mail.user}>`,
            to: emailTo,
            subject: "Confirm registration",
            text: `Confirm registration on site FIN \n ${confirmationLink}`,
            html: this.substitute(htmlFile, {confirmationLink: confirmationLink})
        };

        await this.transporter.sendMail(mailOptions);
    }

    private substitute(str, replacements) {
        let result = str;
        for (const key in replacements) {
            result = result.replace(`{{${key}}}`, replacements[key]);
        }
        return result;
    }
}
