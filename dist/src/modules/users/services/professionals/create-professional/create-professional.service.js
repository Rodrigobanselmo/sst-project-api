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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProfessionalService = void 0;
const UsersRepository_1 = require("./../../../repositories/implementations/UsersRepository");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../../shared/constants/enum/authorization");
const ProfessionalRepository_1 = require("./../../../repositories/implementations/ProfessionalRepository");
const client_1 = require("@prisma/client");
const invite_users_service_1 = require("../../invites/invite-users/invite-users.service");
const SendGridProvider_1 = require("../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
let CreateProfessionalService = class CreateProfessionalService {
    constructor(professionalRepository, userRepository, mailProvider) {
        this.professionalRepository = professionalRepository;
        this.userRepository = userRepository;
        this.mailProvider = mailProvider;
    }
    async execute(_a, user) {
        var createDataDto = __rest(_a, []);
        const professionalFound = await this.professionalRepository.findFirstNude({
            where: {
                companyId: user.targetCompanyId,
                OR: [
                    { cpf: createDataDto.cpf || 'not-found' },
                    { user: { email: createDataDto.email || 'not-found' } },
                    ...createDataDto.councils.map((council) => ({
                        councils: {
                            some: {
                                councilId: council.councilId || 'not-found',
                                councilType: council.councilType || 'not-found',
                                councilUF: council.councilUF || 'not-found',
                            },
                        },
                    })),
                ],
            },
        });
        const permissions = [];
        const roles = [];
        if ([client_1.ProfessionalTypeEnum.DOCTOR, client_1.ProfessionalTypeEnum.NURSE].includes(createDataDto.type)) {
            roles.push(authorization_1.RoleEnum.DOCTOR);
        }
        if (professionalFound === null || professionalFound === void 0 ? void 0 : professionalFound.id)
            throw new common_1.BadRequestException('Professional já cadastrado');
        if (createDataDto.userId) {
            const useCompany = [
                {
                    permissions,
                    roles,
                    companyId: user.targetCompanyId,
                },
            ];
            const userPayload = await this.userRepository.update(createDataDto.userId, {
                type: createDataDto.type || undefined,
                phone: createDataDto.phone || undefined,
            }, useCompany);
            return userPayload.professional;
        }
        const sendEmail = createDataDto.sendEmail;
        delete createDataDto.userId;
        delete createDataDto.sendEmail;
        const professional = await this.professionalRepository.create(Object.assign(Object.assign({}, createDataDto), { roles }), user.targetCompanyId);
        if (sendEmail)
            await (0, invite_users_service_1.inviteNewUser)(this.mailProvider, professional.invite);
        return professional;
    }
};
CreateProfessionalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProfessionalRepository_1.ProfessionalRepository,
        UsersRepository_1.UsersRepository,
        SendGridProvider_1.SendGridProvider])
], CreateProfessionalService);
exports.CreateProfessionalService = CreateProfessionalService;
//# sourceMappingURL=create-professional.service.js.map