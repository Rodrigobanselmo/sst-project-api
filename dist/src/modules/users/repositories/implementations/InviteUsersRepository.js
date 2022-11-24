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
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const invite_users_entity_1 = require("../../entities/invite-users.entity");
const DayJSProvider_1 = require("../../../../shared/providers/DateProvider/implementations/DayJSProvider");
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
    async findById(id, options) {
        const invite = await this.prisma.inviteUsers.findUnique(Object.assign({ where: { id } }, options));
        if (!invite)
            return;
        return new invite_users_entity_1.InviteUsersEntity(invite);
    }
    async findAllByCompanyId(companyId) {
        const invites = await this.prisma.inviteUsers.findMany({
            where: {
                companyId,
                expires_date: { lte: (0, DayJSProvider_1.dayjs)().add(10, 'year').toDate() },
            },
        });
        return invites.map((invite) => new invite_users_entity_1.InviteUsersEntity(invite));
    }
    async findAllByEmail(email) {
        const invites = await this.prisma.inviteUsers.findMany({
            where: { email },
            include: { company: { select: { name: true, logoUrl: true } } },
        });
        return invites.map((invite) => new invite_users_entity_1.InviteUsersEntity(Object.assign(Object.assign({}, invite), { companyName: invite.company.name, logo: invite.company.logoUrl })));
    }
    async find(query, pagination, options = {}) {
        const whereInit = {
            AND: [],
        };
        const include = Object.assign({}, options === null || options === void 0 ? void 0 : options.include);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['ids', 'showProfessionals'],
        });
        if ('ids' in query) {
            where.AND.push({
                id: { in: query.ids },
            });
        }
        if (!('showProfessionals' in query)) {
            where.AND.push({
                expires_date: { lte: (0, DayJSProvider_1.dayjs)().add(10, 'year').toDate() },
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.inviteUsers.count({
                where,
            }),
            this.prisma.inviteUsers.findMany({
                where,
                include: Object.keys(include).length > 0 ? include : undefined,
                take: pagination.take || 20,
                skip: pagination.skip || 0,
                orderBy: { expires_date: 'asc' },
            }),
        ]);
        return {
            data: response[1].map((exam) => new invite_users_entity_1.InviteUsersEntity(exam)),
            count: response[0],
        };
    }
    async deleteById(companyId, id) {
        const invite = await this.prisma.inviteUsers.deleteMany({
            where: { id, companyId },
        });
        if (!invite)
            return;
        return invite;
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