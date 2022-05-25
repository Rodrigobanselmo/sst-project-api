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
exports.SendForgotPassMailService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const UsersRepository_1 = require("../../../../modules/users/repositories/implementations/UsersRepository");
const DayJSProvider_1 = require("../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const AwsSesProvider_1 = require("../../../../shared/providers/MailProvider/implementations/AwsSes/AwsSesProvider");
const RefreshTokensRepository_1 = require("../../repositories/implementations/RefreshTokensRepository");
let SendForgotPassMailService = class SendForgotPassMailService {
    constructor(usersRepository, refreshTokensRepository, mailProvider, dateProvider) {
        this.usersRepository = usersRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.mailProvider = mailProvider;
        this.dateProvider = dateProvider;
    }
    async execute(email) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User does not exists');
        }
        const templatePath = (0, path_1.resolve)(__dirname, '..', '..', '..', '..', '..', 'templates', 'email', 'ForgotPassword.hbs');
        const expires_date = this.dateProvider.addHours(new Date(), 3);
        const refresh_token = await this.refreshTokensRepository.create('reset', user.id, expires_date);
        const variables = {
            name: 'user.name',
            link: `${process.env.APP_HOST}/password/reset?token=${refresh_token.id}`,
        };
        await this.mailProvider.sendMail({
            path: templatePath,
            subject: 'Recuperação de Senha',
            to: email,
            variables,
        });
    }
};
SendForgotPassMailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository,
        RefreshTokensRepository_1.RefreshTokensRepository,
        AwsSesProvider_1.AwsSesProvider,
        DayJSProvider_1.DayJSProvider])
], SendForgotPassMailService);
exports.SendForgotPassMailService = SendForgotPassMailService;
//# sourceMappingURL=send-forgot-pass-mail.service.js.map