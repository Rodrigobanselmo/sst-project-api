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
exports.InviteUsersService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const SendGridProvider_1 = require("../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
const InviteUsersRepository_1 = require("../../../repositories/implementations/InviteUsersRepository");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
let InviteUsersService = class InviteUsersService {
    constructor(inviteUsersRepository, usersRepository, dateProvider, mailProvider) {
        this.inviteUsersRepository = inviteUsersRepository;
        this.usersRepository = usersRepository;
        this.dateProvider = dateProvider;
        this.mailProvider = mailProvider;
    }
    async execute(inviteUserDto) {
        const user = await this.usersRepository.findByEmail(inviteUserDto.email);
        if (user) {
            const userAlreadyAdded = user.companies.some((company) => company.companyId === inviteUserDto.companyId);
            if (userAlreadyAdded)
                throw new common_1.BadRequestException('User already added');
        }
        const expires_date = this.dateProvider.addHours(new Date(), 3);
        await this.inviteUsersRepository.deleteByCompanyIdAndEmail(inviteUserDto.companyId, inviteUserDto.email);
        const invite = await this.inviteUsersRepository.create(inviteUserDto, expires_date);
        await inviteNewUser(this.mailProvider, invite);
        return invite;
    }
};
InviteUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [InviteUsersRepository_1.InviteUsersRepository,
        UsersRepository_1.UsersRepository,
        DayJSProvider_1.DayJSProvider,
        SendGridProvider_1.SendGridProvider])
], InviteUsersService);
exports.InviteUsersService = InviteUsersService;
const inviteNewUser = async (mailProvider, invite) => {
    const templatePath = (0, path_1.resolve)(__dirname, '..', '..', '..', '..', '..', '..', 'templates', 'email', 'inviteUser.hbs');
    const variables = {
        company: invite.companyName,
        link: `${process.env.APP_HOST}/cadastro/?token=${invite.id}&email=${invite.email}`,
    };
    await mailProvider.sendMail({
        path: templatePath,
        subject: 'Convite para se tornar membro',
        to: invite.email,
        variables,
    });
};
//# sourceMappingURL=invite-users.service.js.map