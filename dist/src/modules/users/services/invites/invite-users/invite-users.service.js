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
exports.inviteNewUser = exports.InviteUsersService = void 0;
const authorization_1 = require("./../../../../../shared/constants/enum/authorization");
const CompanyRepository_1 = require("./../../../../company/repositories/implementations/CompanyRepository");
const AuthGroupRepository_1 = require("./../../../../auth/repositories/implementations/AuthGroupRepository");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const SendGridProvider_1 = require("../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
const InviteUsersRepository_1 = require("../../../repositories/implementations/InviteUsersRepository");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const uuid_1 = require("uuid");
let InviteUsersService = class InviteUsersService {
    constructor(inviteUsersRepository, usersRepository, authGroupRepository, dateProvider, companyRepository, mailProvider) {
        this.inviteUsersRepository = inviteUsersRepository;
        this.usersRepository = usersRepository;
        this.authGroupRepository = authGroupRepository;
        this.dateProvider = dateProvider;
        this.companyRepository = companyRepository;
        this.mailProvider = mailProvider;
    }
    async execute(inviteUserDto, userPayloadDto) {
        const userRoles = userPayloadDto.roles || [];
        const userPermissions = userPayloadDto.permissions || [];
        const userToAdd = await this.usersRepository.findByEmail(inviteUserDto.email);
        const company = await this.companyRepository.findById(inviteUserDto.companyId);
        const isConsulting = company.isConsulting;
        if (!isConsulting)
            inviteUserDto.companiesIds = [];
        const addRoles = [...(inviteUserDto.roles || [])];
        const addPermissions = [...(inviteUserDto.permissions || [])];
        if (inviteUserDto.groupId) {
            const authGroup = await this.authGroupRepository.findById(inviteUserDto.groupId, userPayloadDto.companyId);
            if (!(authGroup === null || authGroup === void 0 ? void 0 : authGroup.id))
                throw new common_1.BadRequestException(errorMessage_1.ErrorInvitesEnum.AUTH_GROUP_NOT_FOUND);
            addPermissions.push(...authGroup.permissions);
            addRoles.push(...authGroup.roles);
        }
        if (!userRoles.includes(authorization_1.RoleEnum.MASTER)) {
            const hasAllRoles = addRoles.every((role) => userRoles.includes(role));
            const hasAllPermissions = addPermissions.every((addPermission) => userPermissions.some((userPermission) => userPermission.split('-')[0] === addPermission.split('-')[0] &&
                Array.from(addPermission.split('-')[1] || '').every((crud) => (userPermission.split('-')[1] || '').includes(crud))));
            if (!hasAllRoles || !hasAllPermissions)
                throw new common_1.ForbiddenException(errorMessage_1.ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS);
        }
        if (userToAdd) {
            let userAlreadyAdded = userToAdd.companies.some((company) => company.companyId === inviteUserDto.companyId);
            if (isConsulting)
                userAlreadyAdded = userToAdd.companies.some((company) => inviteUserDto.companiesIds.includes(company.companyId));
            if (userAlreadyAdded)
                throw new common_1.BadRequestException(errorMessage_1.ErrorInvitesEnum.USER_ALREADY_EXIST);
        }
        let companies = {};
        if (!userRoles.includes(authorization_1.RoleEnum.MASTER))
            companies = await this.companyRepository.findAllRelatedByCompanyId(inviteUserDto.companyId, { companiesIds: (inviteUserDto === null || inviteUserDto === void 0 ? void 0 : inviteUserDto.companiesIds) || [] }, { skip: 0, take: 100 }, { select: { id: true } });
        if (userRoles.includes(authorization_1.RoleEnum.MASTER))
            companies = await this.companyRepository.findAll({ companiesIds: (inviteUserDto === null || inviteUserDto === void 0 ? void 0 : inviteUserDto.companiesIds) || [] }, { skip: 0, take: 100 }, { select: { id: true } });
        const expires_date = this.dateProvider.addDay(new Date(), 7);
        await this.inviteUsersRepository.deleteByCompanyIdAndEmail(inviteUserDto.companyId, inviteUserDto.email);
        const invite = await this.inviteUsersRepository.create(Object.assign(Object.assign({ email: (0, uuid_1.v4)() }, inviteUserDto), { companiesIds: companies.data.map((company) => company.id) }), expires_date);
        await (0, exports.inviteNewUser)(this.mailProvider, invite);
        return invite;
    }
};
InviteUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [InviteUsersRepository_1.InviteUsersRepository,
        UsersRepository_1.UsersRepository,
        AuthGroupRepository_1.AuthGroupRepository,
        DayJSProvider_1.DayJSProvider,
        CompanyRepository_1.CompanyRepository,
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
exports.inviteNewUser = inviteNewUser;
//# sourceMappingURL=invite-users.service.js.map