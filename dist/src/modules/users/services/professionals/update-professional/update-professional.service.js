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
exports.UpdateProfessionalService = void 0;
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const common_1 = require("@nestjs/common");
const ProfessionalRepository_1 = require("../../../repositories/implementations/ProfessionalRepository");
const invite_users_service_1 = require("../../invites/invite-users/invite-users.service");
const SendGridProvider_1 = require("./../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
let UpdateProfessionalService = class UpdateProfessionalService {
    constructor(mailProvider, professionalRepository) {
        this.mailProvider = mailProvider;
        this.professionalRepository = professionalRepository;
    }
    async execute(_a, user) {
        var updateDataDto = __rest(_a, []);
        if (!user.isMaster) {
            const foundProfessional = await this.professionalRepository.findFirstNude({
                where: {
                    AND: [
                        { id: updateDataDto.id },
                        {
                            OR: [
                                {
                                    user: {
                                        companies: {
                                            some: {
                                                companyId: {
                                                    in: [user.companyId, user.targetCompanyId],
                                                },
                                            },
                                        },
                                    },
                                },
                                { companyId: { in: [user.companyId, user.targetCompanyId] } },
                            ],
                        },
                    ],
                },
                include: { user: { include: { companies: true } }, councils: true },
            });
            if (!(foundProfessional === null || foundProfessional === void 0 ? void 0 : foundProfessional.id)) {
                throw new common_1.ForbiddenException(errorMessage_1.ErrorMessageEnum.PROFESSIONAL_NOT_FOUND);
            }
        }
        const sendEmail = updateDataDto.sendEmail;
        delete updateDataDto.userId;
        delete updateDataDto.sendEmail;
        const professional = await this.professionalRepository.update(updateDataDto);
        if (sendEmail)
            await (0, invite_users_service_1.inviteNewUser)(this.mailProvider, professional.invite);
        return professional;
    }
};
UpdateProfessionalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [SendGridProvider_1.SendGridProvider, ProfessionalRepository_1.ProfessionalRepository])
], UpdateProfessionalService);
exports.UpdateProfessionalService = UpdateProfessionalService;
//# sourceMappingURL=update-professional.service.js.map