"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherealMailProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class EtherealMailProvider {
    constructor() {
        if (process.env.NODE_ENV !== 'test')
            nodemailer_1.default
                .createTestAccount()
                .then((account) => {
                const transporter = nodemailer_1.default.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    },
                });
                this.client = transporter;
            })
                .catch((err) => {
                console.error(`Failed to create a testing account. ${err.message}`);
            });
    }
    async sendMail({ path, subject, to, variables }) {
        if (process.env.NODE_ENV === 'test')
            return;
        if (process.env.NODE_ENV === 'development')
            return;
        const templateFileContent = fs_1.default.readFileSync(path).toString('utf-8');
        const templateParse = handlebars_1.default.compile(templateFileContent);
        const templateHTML = templateParse(variables);
        const message = await this.client.sendMail({
            from: 'simple <noreply@simple.com.br>',
            to,
            subject,
            html: templateHTML,
        });
        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(message));
    }
}
exports.EtherealMailProvider = EtherealMailProvider;
//# sourceMappingURL=EtherealMailProvider.js.map