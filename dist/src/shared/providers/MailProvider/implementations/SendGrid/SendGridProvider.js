"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridProvider = void 0;
const errorMessage_1 = require("./../../../../constants/enum/errorMessage");
const common_1 = require("@nestjs/common");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const emails_1 = require("../../../../../shared/constants/enum/emails");
class SendGridProvider {
    constructor() {
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
        this.client = mail_1.default;
    }
    async sendMail({ path, subject, to, variables, attachments, source = emails_1.EmailsEnum.VALIDATION }) {
        try {
            if (!to)
                return;
            const templateFileContent = fs_1.default.readFileSync(path).toString('utf-8');
            const templateParse = handlebars_1.default.compile(templateFileContent);
            const templateHTML = templateParse(variables);
            const random = String(Math.floor(Math.random() * 1000000));
            await this.client.send({
                to: to,
                from: source.replace(':id', random),
                subject: subject,
                html: templateHTML,
                attachments,
            });
        }
        catch (error) {
            console.error(error);
            throw new common_1.UnprocessableEntityException(errorMessage_1.ErrorMessageEnum.EMAIL_NOT_SEND);
        }
    }
}
exports.SendGridProvider = SendGridProvider;
//# sourceMappingURL=SendGridProvider.js.map