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
exports.getCompanyPermissionByToken = exports.CreateUserService = void 0;
const ProfessionalRepository_1 = require("./../../../repositories/implementations/ProfessionalRepository");
const common_1 = require("@nestjs/common");
const InviteUsersRepository_1 = require("../../../../../modules/users/repositories/implementations/InviteUsersRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const HashProvider_1 = require("../../../../../shared/providers/HashProvider/implementations/HashProvider");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
const find_by_token_service_1 = require("../../invites/find-by-token/find-by-token.service");
let CreateUserService = class CreateUserService {
    constructor(userRepository, professionalRepository, findByTokenService, dateProvider, hashProvider, inviteUsersRepository) {
        this.userRepository = userRepository;
        this.professionalRepository = professionalRepository;
        this.findByTokenService = findByTokenService;
        this.dateProvider = dateProvider;
        this.hashProvider = hashProvider;
        this.inviteUsersRepository = inviteUsersRepository;
    }
    async execute(_a) {
        var { token, password } = _a, restCreateUserDto = __rest(_a, ["token", "password"]);
        const passHash = await this.hashProvider.createHash(password);
        const userAlreadyExist = await this.userRepository.findByEmail(restCreateUserDto.email);
        if (userAlreadyExist)
            throw new common_1.BadRequestException(errorMessage_1.ErrorAuthEnum.USER_ALREADY_EXIST);
        const { companies, companyId, invite } = await (0, exports.getCompanyPermissionByToken)(token, this.findByTokenService, this.dateProvider);
        const userData = Object.assign(Object.assign({}, restCreateUserDto), { password: passHash });
        const professional = invite === null || invite === void 0 ? void 0 : invite.professional;
        const user = await this.userRepository.create(userData, companies, professional);
        if (invite && invite.email && companyId)
            await this.inviteUsersRepository.deleteByCompanyIdAndEmail(companyId, invite.email);
        delete user.password;
        return user;
    }
};
CreateUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository,
        ProfessionalRepository_1.ProfessionalRepository,
        find_by_token_service_1.FindByTokenService,
        DayJSProvider_1.DayJSProvider,
        HashProvider_1.HashProvider,
        InviteUsersRepository_1.InviteUsersRepository])
], CreateUserService);
exports.CreateUserService = CreateUserService;
const getCompanyPermissionByToken = async (token, findByTokenService, dateProvider) => {
    if (!token)
        return { companies: [] };
    const invite = await findByTokenService.execute(token);
    const currentDate = dateProvider.dateNow();
    const expires_date = new Date(dateProvider.convertToUTC(invite.expires_date));
    if (currentDate > expires_date) {
        throw new common_1.BadRequestException(errorMessage_1.ErrorInvitesEnum.TOKEN_EXPIRES);
    }
    let companies = invite.companiesIds.map((companyId) => ({
        permissions: invite.permissions,
        roles: invite.roles,
        companyId,
    }));
    if (companies.length === 0)
        companies = [
            {
                permissions: invite.permissions,
                roles: invite.roles,
                companyId: invite.companyId,
            },
        ];
    return { companies, companyId: invite.companyId, invite };
};
exports.getCompanyPermissionByToken = getCompanyPermissionByToken;
//# sourceMappingURL=create-user.service.js.map