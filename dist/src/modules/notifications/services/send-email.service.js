"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailService = void 0;
const emailsTemplates_1 = require("./../../../shared/constants/enum/emailsTemplates");
const prisma_service_1 = require("./../../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const SendGridProvider_1 = require("../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
let SendEmailService = class SendEmailService {
    constructor(mailProvider, prisma) {
        this.mailProvider = mailProvider;
        this.prisma = prisma;
    }
    async execute(user, dto, files) {
        if (dto.template === emailsTemplates_1.EmailsTemplatesEnum.REFERRAL_GUIDE) {
            this.sendReferralGuide(user, dto, files);
        }
    }
    async sendReferralGuide(user, dto, files) {
        const templatePath = (0, path_1.resolve)(__dirname, '..', '..', '..', '..', 'templates', 'email', 'referralGuide.hbs');
        await this.mailProvider.sendMail({
            path: templatePath,
            subject: 'Guia Exame Médico',
            to: dto.emails,
            attachments: files.map((file) => {
                return {
                    content: file.buffer.toString('base64'),
                    type: 'application/pdf',
                    filename: 'guia-de-encaminhamento.pdf',
                };
            }),
        });
    }
};
SendEmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [SendGridProvider_1.SendGridProvider, prisma_service_1.PrismaService])
], SendEmailService);
exports.SendEmailService = SendEmailService;
//# sourceMappingURL=send-email.service.js.map