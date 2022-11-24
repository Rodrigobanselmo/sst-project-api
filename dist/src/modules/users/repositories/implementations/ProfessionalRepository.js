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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const professional_entity_1 = require("../../entities/professional.entity");
const user_entity_1 = require("../../entities/user.entity");
const dayjs_1 = __importDefault(require("dayjs"));
const invite_users_entity_1 = require("../../entities/invite-users.entity");
let ProfessionalRepository = class ProfessionalRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a, companyId, options = {}) {
        var { inviteId, roles, councils } = _a, data = __rest(_a, ["inviteId", "roles", "councils"]);
        const invite = await this.prisma.inviteUsers.create({
            data: {
                id: inviteId,
                expires_date: (0, dayjs_1.default)().add(100, 'y').toDate(),
                email: data.email,
                companyId,
                companiesIds: [companyId],
                permissions: [],
                roles: roles || [],
            },
        });
        const hasCouncil = councils && councils.length > 0;
        if (!hasCouncil) {
            councils = [
                {
                    councilId: '',
                    councilUF: '',
                    councilType: '',
                },
            ];
        }
        const professional = await this.prisma.professional.create(Object.assign(Object.assign({}, options), { data: Object.assign(Object.assign({}, data), { companyId, inviteId: invite.id, councils: {
                    createMany: {
                        data: councils.map((c) => ({
                            councilId: c.councilId,
                            councilUF: c.councilUF,
                            councilType: c.councilType,
                        })),
                    },
                } }), include: Object.assign({ user: true }, options.include) }));
        return new professional_entity_1.ProfessionalEntity(Object.assign(Object.assign({}, professional), { user: new user_entity_1.UserEntity(professional.user), invite: new invite_users_entity_1.InviteUsersEntity(invite) }));
    }
    async update(_a, options = {}) {
        var { id, inviteId, councils } = _a, data = __rest(_a, ["id", "inviteId", "councils"]);
        const professional = await this.prisma.professional.update(Object.assign(Object.assign({}, options), { data: Object.assign({}, data), where: { id }, include: Object.assign(Object.assign({ user: true }, options.include), { councils: true }) }));
        if ((professional === null || professional === void 0 ? void 0 : professional.id) && councils) {
            councils = councils.filter((c) => c.councilId !== '');
            if (councils.length == 0) {
                councils.push({ councilId: '', councilType: '', councilUF: '' });
            }
            const councilsCreate = await Promise.all(councils.map(async ({ councilId, councilType, councilUF }) => {
                if ((councilId && councilType && councilUF) || (councilId == '' && councilType == '' && councilUF == ''))
                    return await this.prisma.professionalCouncil.upsert({
                        create: {
                            councilId,
                            councilType,
                            councilUF,
                            professionalId: professional.id,
                        },
                        update: {},
                        where: {
                            councilType_councilUF_councilId_professionalId: {
                                councilId,
                                councilType,
                                councilUF,
                                professionalId: professional.id,
                            },
                        },
                    });
            }));
            await Promise.all(professional.councils.map(async (c) => {
                if (councilsCreate.find((cCreated) => (cCreated === null || cCreated === void 0 ? void 0 : cCreated.id) == c.id))
                    return;
                try {
                    await this.prisma.professionalCouncil.delete({
                        where: {
                            id: c.id,
                        },
                    });
                }
                catch (err) { }
            }));
            professional.councils = councilsCreate.filter((i) => i);
        }
        return new professional_entity_1.ProfessionalEntity(Object.assign(Object.assign({}, professional), { user: new user_entity_1.UserEntity(professional.user) }));
    }
    async findByCompanyId(query, pagination, options = {}) {
        const companyId = query.companyId;
        const userCompanyId = query.userCompanyId;
        delete query.companyId;
        delete query.userCompanyId;
        const where = {
            AND: [
                {
                    OR: [
                        { companyId: { in: [userCompanyId, companyId] } },
                        {
                            user: {
                                companies: {
                                    some: {
                                        companyId: { in: [userCompanyId, companyId] },
                                        status: 'ACTIVE',
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        };
        if ('search' in query) {
            where.AND.push({
                OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                ],
            });
            delete query.search;
        }
        if ('companies' in query) {
            where.AND.push({
                OR: [
                    {
                        company: { id: { in: query.companies } },
                    },
                    {
                        user: {
                            companies: {
                                some: {
                                    companyId: { in: query.companies },
                                    status: 'ACTIVE',
                                },
                            },
                        },
                    },
                ],
            });
            delete query.companies;
        }
        Object.entries(query).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                where.AND.push({
                    [key]: { in: value },
                });
            }
            else if (value) {
                where.AND.push({
                    [key]: {
                        contains: value,
                        mode: 'insensitive',
                    },
                });
            }
        });
        const response = await this.prisma.$transaction([
            this.prisma.professional.count({
                where,
            }),
            this.prisma.professional.findMany({
                where,
                take: pagination.take || 10,
                skip: pagination.skip || 0,
                orderBy: { name: 'asc' },
                include: { user: true, councils: true },
            }),
        ]);
        return {
            data: response[1].map((prof) => new professional_entity_1.ProfessionalEntity(Object.assign(Object.assign({}, prof), { user: new user_entity_1.UserEntity(prof.user) }))),
            count: response[0],
        };
    }
    async findCouncilByCompanyId(query, pagination, options = {}) {
        const companyId = query.companyId;
        const userCompanyId = query.userCompanyId;
        const byCouncil = query.byCouncil;
        delete query.companyId;
        delete query.byCouncil;
        delete query.userCompanyId;
        const where = {
            AND: [
                {
                    OR: [
                        { companyId: { in: [userCompanyId, companyId] } },
                        {
                            user: {
                                companies: {
                                    some: {
                                        companyId: { in: [userCompanyId, companyId] },
                                        status: 'ACTIVE',
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        };
        if ('search' in query) {
            where.AND.push({
                OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                ],
            });
            delete query.search;
        }
        if ('companies' in query) {
            where.AND.push({
                OR: [
                    {
                        company: { id: { in: query.companies } },
                    },
                    {
                        user: {
                            companies: {
                                some: {
                                    companyId: { in: query.companies },
                                    status: 'ACTIVE',
                                },
                            },
                        },
                    },
                ],
            });
            delete query.companies;
        }
        Object.entries(query).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                where.AND.push({
                    [key]: { in: value },
                });
            }
            else if (value) {
                where.AND.push({
                    [key]: {
                        contains: value,
                        mode: 'insensitive',
                    },
                });
            }
        });
        const response = byCouncil
            ? await this.prisma.$transaction([
                this.prisma.professionalCouncil.count({
                    where: {
                        professional: where,
                    },
                }),
                this.prisma.professionalCouncil.findMany({
                    where: {
                        professional: where,
                    },
                    take: pagination.take || 10,
                    skip: pagination.skip || 0,
                    orderBy: { professional: { name: 'asc' } },
                    include: {
                        professional: { include: { user: true } },
                    },
                }),
            ])
            : await this.prisma.$transaction([
                this.prisma.professional.count({
                    where,
                }),
                this.prisma.professional.findMany({
                    where,
                    take: pagination.take || 10,
                    skip: pagination.skip || 0,
                    orderBy: { name: 'asc' },
                    include: { user: true, councils: true },
                }),
            ]);
        return {
            data: response[1].map((prof) => new professional_entity_1.ProfessionalEntity(Object.assign(Object.assign({}, prof), { user: new user_entity_1.UserEntity(prof.user) }))),
            count: response[0],
        };
    }
    async findFirstNude(options = {}) {
        const professional = await this.prisma.professional.findFirst(Object.assign({}, options));
        return new professional_entity_1.ProfessionalEntity(professional);
    }
};
ProfessionalRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfessionalRepository);
exports.ProfessionalRepository = ProfessionalRepository;
//# sourceMappingURL=ProfessionalRepository.js.map