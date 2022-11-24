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
exports.CompanyGroupRepository = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const company_group_entity_1 = require("../../entities/company-group.entity");
let CompanyGroupRepository = class CompanyGroupRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var { id, companyId, companiesIds, doctorResponsibleId, tecResponsibleId } = _a, data = __rest(_a, ["id", "companyId", "companiesIds", "doctorResponsibleId", "tecResponsibleId"]);
        const uuid = (0, uuid_1.v4)();
        const group = await this.prisma.companyGroup.upsert({
            update: Object.assign(Object.assign({}, data), { doctorResponsible: doctorResponsibleId ? { connect: { id: doctorResponsibleId } } : undefined, tecResponsible: tecResponsibleId ? { connect: { id: tecResponsibleId } } : undefined, companies: companiesIds
                    ? {
                        set: companiesIds.map((companyId) => ({
                            id: companyId,
                        })),
                    }
                    : undefined }),
            create: Object.assign(Object.assign({}, data), { companyId, doctorResponsibleId: doctorResponsibleId, tecResponsibleId: tecResponsibleId, companies: companiesIds
                    ? {
                        connect: companiesIds.map((companyId) => ({
                            id: companyId,
                        })),
                    }
                    : undefined, companyGroup: {
                    create: {
                        id: uuid,
                        name: `(GRUPO EMPRESARIAL) ${data.name}`,
                        isGroup: true,
                        applyingServiceContracts: {
                            createMany: {
                                data: companiesIds.map((companyId) => ({
                                    receivingServiceCompanyId: companyId,
                                })),
                            },
                        },
                        receivingServiceContracts: {
                            createMany: { data: [{ applyingServiceCompanyId: companyId }] },
                        },
                    },
                } }),
            where: { id_companyId: { id: id || 0, companyId } },
            include: {
                companyGroup: { select: { id: true } },
                doctorResponsible: {
                    include: {
                        professional: {
                            select: {
                                name: true,
                                id: true,
                                type: true,
                                cpf: true,
                                userId: true,
                                companyId: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                tecResponsible: {
                    include: {
                        professional: {
                            select: {
                                name: true,
                                id: true,
                                type: true,
                                cpf: true,
                                userId: true,
                                companyId: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        return new company_group_entity_1.CompanyGroupEntity(group);
    }
    async findById(id, companyId, options = {}) {
        const group = await this.prisma.companyGroup.findFirst(Object.assign({ where: { companyId, id }, include: {
                companyGroup: { select: { id: true } },
                doctorResponsible: {
                    include: {
                        professional: {
                            select: {
                                name: true,
                                id: true,
                                type: true,
                                cpf: true,
                                userId: true,
                                companyId: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                tecResponsible: {
                    include: {
                        professional: {
                            select: {
                                name: true,
                                id: true,
                                type: true,
                                cpf: true,
                                userId: true,
                                companyId: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            } }, options));
        return new company_group_entity_1.CompanyGroupEntity(group);
    }
    async findAvailable(companyId, query, pagination, options = {}) {
        const where = {
            AND: [{ companyId }],
        };
        options.select = Object.assign({ companyGroup: { select: { id: true } }, description: true, companyId: true, name: true, id: true, blockResignationExam: true, numAsos: true, esocialSend: true, esocialStart: true, doctorResponsibleId: true, tecResponsibleId: true, doctorResponsible: {
                include: {
                    professional: {
                        select: {
                            name: true,
                            id: true,
                            type: true,
                            cpf: true,
                            userId: true,
                            companyId: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            }, tecResponsible: {
                include: {
                    professional: {
                        select: {
                            name: true,
                            id: true,
                            type: true,
                            cpf: true,
                            userId: true,
                            companyId: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            } }, options.select);
        if ('search' in query) {
            where.AND.push({
                OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
            });
            delete query.search;
        }
        Object.entries(query).forEach(([key, value]) => {
            if (value)
                where.AND.push({
                    [key]: {
                        contains: value,
                        mode: 'insensitive',
                    },
                });
        });
        const response = await this.prisma.$transaction([
            this.prisma.companyGroup.count({
                where,
            }),
            this.prisma.companyGroup.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { name: 'asc' } })),
        ]);
        return {
            data: response[1].map((group) => new company_group_entity_1.CompanyGroupEntity(group)),
            count: response[0],
        };
    }
};
CompanyGroupRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyGroupRepository);
exports.CompanyGroupRepository = CompanyGroupRepository;
//# sourceMappingURL=CompanyGroupRepository.js.map