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
exports.FindByTokenService = void 0;
const common_1 = require("@nestjs/common");
const InviteUsersRepository_1 = require("../../../repositories/implementations/InviteUsersRepository");
let FindByTokenService = class FindByTokenService {
    constructor(inviteUsersRepository) {
        this.inviteUsersRepository = inviteUsersRepository;
    }
    async execute(token) {
        var _a, _b, _c, _d;
        const invite = await this.inviteUsersRepository.findById(token, {
            include: {
                company: { select: { name: true, logoUrl: true } },
                professional: true,
            },
        });
        if (!(invite === null || invite === void 0 ? void 0 : invite.id))
            throw new common_1.BadRequestException('Invite token not found');
        if ((_b = (_a = invite) === null || _a === void 0 ? void 0 : _a.company) === null || _b === void 0 ? void 0 : _b.name)
            invite.companyName = invite.company.name;
        if ((_d = (_c = invite) === null || _c === void 0 ? void 0 : _c.company) === null || _d === void 0 ? void 0 : _d.logoUrl)
            invite.logo = invite.company.logoUrl;
        return invite;
    }
};
FindByTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [InviteUsersRepository_1.InviteUsersRepository])
], FindByTokenService);
exports.FindByTokenService = FindByTokenService;
//# sourceMappingURL=find-by-token.service.js.map