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
exports.UpdateUserService = void 0;
const common_1 = require("@nestjs/common");
const InviteUsersRepository_1 = require("../../../../../modules/users/repositories/implementations/InviteUsersRepository");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const HashProvider_1 = require("../../../../../shared/providers/HashProvider/implementations/HashProvider");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
const find_by_token_service_1 = require("../../invites/find-by-token/find-by-token.service");
const create_user_service_1 = require("../create-user/create-user.service");
let UpdateUserService = class UpdateUserService {
    constructor(userRepository, hashProvider, dateProvider, findByTokenService, inviteUsersRepository) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.dateProvider = dateProvider;
        this.findByTokenService = findByTokenService;
        this.inviteUsersRepository = inviteUsersRepository;
    }
    async execute(id, _a) {
        var { password, oldPassword, token } = _a, restUpdateUserDto = __rest(_a, ["password", "oldPassword", "token"]);
        if (!id)
            throw new common_1.BadRequestException(`Bad Request`);
        const updateUserDto = Object.assign({}, restUpdateUserDto);
        const userData = await this.userRepository.findById(id);
        if (!userData)
            throw new common_1.BadRequestException(`user #${id} not found`);
        if (restUpdateUserDto.googleExternalId) {
            const user = await this.userRepository.findByGoogleExternalId(restUpdateUserDto.googleExternalId);
            if (user && user.id !== id) {
                await this.userRepository.update(user.id, {
                    googleExternalId: null,
                });
            }
        }
        if (password) {
            if (!oldPassword)
                throw new common_1.BadRequestException(`Old password missing`);
            const passwordMatch = await this.hashProvider.compare(oldPassword, userData.password);
            if (!passwordMatch) {
                throw new common_1.BadRequestException('password incorrect');
            }
            const passHash = await this.hashProvider.createHash(password);
            updateUserDto.password = passHash;
        }
        const { companies, invite, companyId } = await (0, create_user_service_1.getCompanyPermissionByToken)(token, this.findByTokenService, this.dateProvider);
        const user = await this.userRepository.update(id, Object.assign(Object.assign({}, updateUserDto), (invite &&
            (invite === null || invite === void 0 ? void 0 : invite.professional) && Object.assign(Object.assign(Object.assign({}, ((invite === null || invite === void 0 ? void 0 : invite.professional.councils) && {
            councils: invite.professional.councils.map(({ councilId, councilType, councilUF }) => ({
                councilId,
                councilType,
                councilUF,
            })),
        })), ((invite === null || invite === void 0 ? void 0 : invite.professional.phone) && {
            phone: invite.professional.phone,
        })), ((invite === null || invite === void 0 ? void 0 : invite.professional.type) && {
            type: invite.professional.type,
        })))), companies);
        if (invite && invite.email && companyId)
            await this.inviteUsersRepository.deleteByCompanyIdAndEmail(companyId, invite.email);
        return user;
    }
};
UpdateUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository,
        HashProvider_1.HashProvider,
        DayJSProvider_1.DayJSProvider,
        find_by_token_service_1.FindByTokenService,
        InviteUsersRepository_1.InviteUsersRepository])
], UpdateUserService);
exports.UpdateUserService = UpdateUserService;
//# sourceMappingURL=update-user.service.js.map