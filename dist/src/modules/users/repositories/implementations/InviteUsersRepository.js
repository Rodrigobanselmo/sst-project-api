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
exports.InviteUsersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const invite_users_entity_1 = require("../../entities/invite-users.entity");
let InviteUsersRepository = class InviteUsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(inviteUserDto, expires_date) {
        const inviteUser = await this.prisma.inviteUsers.create({
            data: Object.assign(Object.assign({}, inviteUserDto), { expires_date }),
        });
        return new invite_users_entity_1.InviteUsersEntity(inviteUser);
    }
    async findByCompanyIdAndEmail(companyId, email) {
        const invite = await this.prisma.inviteUsers.findFirst({
            where: { email, companyId },
        });
        if (!invite)
            return;
        return new invite_users_entity_1.InviteUsersEntity(invite);
    }
    async findById(id) {
        const invite = await this.prisma.inviteUsers.findUnique({
            where: { id },
        });
        if (!invite)
            return;
        return new invite_users_entity_1.InviteUsersEntity(invite);
    }
    async deleteByCompanyIdAndEmail(companyId, email) {
        const invite = await this.prisma.inviteUsers.deleteMany({
            where: { email, companyId },
        });
        if (!invite)
            return;
        return invite;
    }
    async deleteAllOldInvites(currentDate) {
        const deletedResult = await this.prisma.inviteUsers.deleteMany({
            where: {
                expires_date: {
                    lte: currentDate,
                },
            },
        });
        return deletedResult;
    }
};
InviteUsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InviteUsersRepository);
exports.InviteUsersRepository = InviteUsersRepository;
//# sourceMappingURL=InviteUsersRepository.js.map