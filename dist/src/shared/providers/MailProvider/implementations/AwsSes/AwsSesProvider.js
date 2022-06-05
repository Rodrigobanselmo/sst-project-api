"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSesProvider = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const emails_1 = require("../../../../../shared/constants/enum/emails");
class AwsSesProvider {
    constructor() {
        this.client = new aws_sdk_1.SES({ region: process.env.AWS_SES_REGION });
    }
    async sendMail({ path, subject, to, variables, source = emails_1.EmailsEnum.VALIDATION, }) {
        const templateFileContent = fs_1.default.readFileSync(path).toString('utf-8');
        const templateParse = handlebars_1.default.compile(templateFileContent);
        const templateHTML = templateParse(variables);
        const random = String(Math.floor(Math.random() * 1000000));
        const message = await this.client
            .sendEmail({
            Source: source.replace(':id', random),
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: { Data: subject },
                Body: {
                    Html: {
                        Data: templateHTML,
                    },
                },
            },
        })
            .promise();
        console.log('Message sent: %s', message.MessageId);
    }
}
exports.AwsSesProvider = AwsSesProvider;
//# sourceMappingURL=AwsSesProvider.js.map