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
exports.CompanyRepository = void 0;
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const company_entity_1 = require("../../entities/company.entity");
const uuid_1 = require("uuid");
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const CharacterizationRepository_1 = require("./CharacterizationRepository");
let CompanyRepository = class CompanyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var { workspace = [], primary_activity = [], secondary_activity = [], license, address, companyId, doctorResponsibleId, tecResponsibleId, phone, email } = _a, createCompanyDto = __rest(_a, ["workspace", "primary_activity", "secondary_activity", "license", "address", "companyId", "doctorResponsibleId", "tecResponsibleId", "phone", "email"]);
        const companyUUId = (0, uuid_1.v4)();
        const isReceivingService = !!companyId;
        const company = await this.prisma.company.create({
            data: Object.assign(Object.assign({ id: companyUUId }, createCompanyDto), { doctorResponsible: doctorResponsibleId ? { connect: { id: doctorResponsibleId } } : undefined, tecResponsible: tecResponsibleId ? { connect: { id: tecResponsibleId } } : undefined, license: Object.keys(license).length === 0
                    ? undefined
                    : {
                        connectOrCreate: {
                            create: Object.assign(Object.assign({}, license), { companyId: companyUUId }),
                            where: { companyId: companyId || 'company not found' },
                        },
                    }, receivingServiceContracts: isReceivingService
                    ? {
                        create: { applyingServiceCompanyId: companyId },
                    }
                    : undefined, address: address
                    ? {
                        create: Object.assign({}, address),
                    }
                    : undefined, workspace: workspace
                    ? {
                        create: [
                            ...workspace.map((_a) => {
                                var { id, address } = _a, work = __rest(_a, ["id", "address"]);
                                return (Object.assign(Object.assign({}, work), { address: { create: address } }));
                            }),
                        ],
                    }
                    : undefined, primary_activity: primary_activity
                    ? {
                        connectOrCreate: [
                            ...primary_activity.map((activity) => ({
                                create: activity,
                                where: { code: activity.code },
                            })),
                        ],
                    }
                    : undefined, secondary_activity: secondary_activity
                    ? {
                        connectOrCreate: [
                            ...secondary_activity.map((activity) => ({
                                create: activity,
                                where: { code: activity.code },
                            })),
                        ],
                    }
                    : undefined, contacts: {
                    create: [{ email, phone, name: 'Contato principal', isPrincipal: true }],
                } }),
            include: {
                workspace: { include: { address: true } },
                group: true,
                primary_activity: true,
                secondary_activity: true,
                license: true,
                address: true,
                doctorResponsible: { include: { professional: true } },
                tecResponsible: { include: { professional: true } },
            },
        });
        return new company_entity_1.CompanyEntity(company);
    }
    async update(_a, options, prismaRef) {
        var { secondary_activity = [], primary_activity = [], workspace = [], employees = [], users = [], address, companyId, doctorResponsibleId, tecResponsibleId } = _a, updateCompanyDto = __rest(_a, ["secondary_activity", "primary_activity", "workspace", "employees", "users", "address", "companyId", "doctorResponsibleId", "tecResponsibleId"]);
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        if (primary_activity.length)
            await this.prisma.company.update({
                where: { id: companyId },
                data: { primary_activity: { set: [] } },
            });
        const companyPrisma = this.prisma.company.update({
            where: { id: companyId },
            data: Object.assign(Object.assign({}, updateCompanyDto), { doctorResponsible: doctorResponsibleId ? { connect: { id: doctorResponsibleId } } : undefined, tecResponsible: tecResponsibleId ? { connect: { id: tecResponsibleId } } : undefined, users: {
                    upsert: [
                        ...users.map((_a) => {
                            var { userId } = _a, user = __rest(_a, ["userId"]);
                            const { roles = [], permissions = [] } = user;
                            return {
                                create: Object.assign(Object.assign({}, user), { permissions, roles, userId }),
                                update: Object.assign({}, user),
                                where: {
                                    companyId_userId: { companyId, userId },
                                },
                            };
                        }),
                    ],
                }, employees: {
                    upsert: [
                        ...employees.map((_a) => {
                            var { id, hierarchyId, description, ghoDescription, realDescription, workspaceIds } = _a, rest = __rest(_a, ["id", "hierarchyId", "description", "ghoDescription", "realDescription", "workspaceIds"]);
                            return {
                                create: Object.assign(Object.assign({}, rest), { hierarchy: hierarchyId
                                        ? {
                                            connect: {
                                                id_companyId: { companyId, id: hierarchyId },
                                            },
                                        }
                                        : undefined }),
                                update: Object.assign(Object.assign({}, rest), { hierarchy: hierarchyId
                                        ? {
                                            connect: {
                                                id_companyId: { companyId, id: hierarchyId },
                                            },
                                        }
                                        : undefined }),
                                where: { cpf_companyId: { cpf: rest.cpf, companyId } },
                            };
                        }),
                    ],
                }, address: address ? { update: Object.assign({}, address) } : undefined, workspace: {
                    upsert: [
                        ...workspace.map((_a) => {
                            var { id, address, companyJson } = _a, work = __rest(_a, ["id", "address", "companyJson"]);
                            return ({
                                create: Object.assign(Object.assign({}, work), { address: { create: address }, companyJson: companyJson || undefined }),
                                update: Object.assign(Object.assign({}, work), { companyJson: companyJson || undefined, address: { update: address } }),
                                where: {
                                    id_companyId: {
                                        companyId,
                                        id: id || 'no-id',
                                    },
                                },
                            });
                        }),
                    ],
                }, primary_activity: {
                    connectOrCreate: [
                        ...primary_activity.map((activity) => ({
                            create: activity,
                            where: { code: activity.code },
                        })),
                    ],
                }, secondary_activity: {
                    connect: [...secondary_activity.map((activity) => ({ code: activity.code }))],
                } }),
            include: {
                workspace: include.workspace ? { include: { address: true } } : false,
                primary_activity: !!include.primary_activity,
                secondary_activity: !!include.secondary_activity,
                license: !!include.license,
                users: !!include.users,
                doctorResponsible: { include: { professional: true } },
                tecResponsible: { include: { professional: true } },
                group: true,
                employees: !!include.employees ? true : false,
            },
        });
        if (prismaRef)
            return companyPrisma;
        return new company_entity_1.CompanyEntity(await companyPrisma);
    }
    async upsertMany(updateCompanyDto, options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const data = await this.prisma.$transaction(updateCompanyDto.map((_a) => {
            var { secondary_activity = [], primary_activity = [], employees = [], workspace = [], address, id, users } = _a, upsertRiskDto = __rest(_a, ["secondary_activity", "primary_activity", "employees", "workspace", "address", "id", "users"]);
            return this.prisma.company.upsert({
                where: { id: id || 'no-id' },
                create: Object.assign(Object.assign({ name: '', cnpj: '', fantasy: '' }, upsertRiskDto), { workspace: {
                        create: [
                            ...workspace.map((_a) => {
                                var { id, address } = _a, work = __rest(_a, ["id", "address"]);
                                return (Object.assign(Object.assign({}, work), { address: { create: address } }));
                            }),
                        ],
                    }, primary_activity: {
                        connect: [
                            ...primary_activity.map((activity) => ({
                                code: activity.code,
                            })),
                        ],
                    }, secondary_activity: {
                        connect: [
                            ...secondary_activity.map((activity) => ({
                                code: activity.code,
                            })),
                        ],
                    } }),
                update: Object.assign(Object.assign({}, upsertRiskDto), { workspace: {
                        upsert: [
                            ...workspace.map((_a) => {
                                var { id, address } = _a, work = __rest(_a, ["id", "address"]);
                                return ({
                                    create: Object.assign(Object.assign({}, work), { address: { create: address } }),
                                    update: Object.assign(Object.assign({}, work), { address: { update: address } }),
                                    where: {
                                        id_companyId: {
                                            companyId: upsertRiskDto.companyId,
                                            id: id || 'no-id',
                                        },
                                    },
                                });
                            }),
                        ],
                    }, primary_activity: {
                        connect: [
                            ...primary_activity.map((activity) => ({
                                code: activity.code,
                            })),
                        ],
                    }, secondary_activity: {
                        connect: [
                            ...secondary_activity.map((activity) => ({
                                code: activity.code,
                            })),
                        ],
                    } }),
                include: {
                    workspace: include.workspace ? { include: { address: true } } : false,
                    primary_activity: !!include.primary_activity,
                    secondary_activity: !!include.secondary_activity,
                    license: !!include.license,
                    users: !!include.users,
                    group: true,
                    doctorResponsible: { include: { professional: true } },
                    tecResponsible: { include: { professional: true } },
                    employees: !!include.employees ? true : false,
                },
            });
        }));
        return data.map((company) => new company_entity_1.CompanyEntity(company));
    }
    async updateDisconnect(_a) {
        var { secondary_activity = [], primary_activity = [], workspace = [], employees = [], users = [], address, companyId } = _a, updateCompanyDto = __rest(_a, ["secondary_activity", "primary_activity", "workspace", "employees", "users", "address", "companyId"]);
        const company = await this.prisma.company.update({
            where: { id: companyId },
            data: Object.assign(Object.assign({}, updateCompanyDto), { users: {
                    delete: [
                        ...users.map(({ userId }) => ({
                            companyId_userId: {
                                companyId: companyId,
                                userId,
                            },
                        })),
                    ],
                }, primary_activity: {
                    disconnect: [...primary_activity.map((activity) => ({ code: activity.code }))],
                }, secondary_activity: {
                    disconnect: [...secondary_activity.map((activity) => ({ code: activity.code }))],
                } }),
            include: {
                workspace: { include: { address: true } },
                primary_activity: true,
                secondary_activity: true,
                group: true,
                license: true,
                doctorResponsible: { include: { professional: true } },
                tecResponsible: { include: { professional: true } },
            },
        });
        return new company_entity_1.CompanyEntity(company);
    }
    async findByIdAll(id, workspaceId, options) {
        const company = (await this.prisma.company.findUnique(Object.assign({ where: { id } }, options)));
        const employeeCount = await this.prisma.employee.count({
            where: {
                companyId: id,
                hierarchy: { workspaces: { some: { id: workspaceId } } },
            },
        });
        company.environments = [];
        if (company.characterization) {
            company.characterization.forEach((characterization) => {
                const isEnv = (0, CharacterizationRepository_1.isEnvironment)(characterization.type);
                if (isEnv)
                    company.environments.push(characterization);
            });
        }
        return new company_entity_1.CompanyEntity(Object.assign(Object.assign({}, company), { employeeCount }));
    }
    async findAllRelatedByCompanyId(companyId, queryFind, pagination, options = { where: undefined }) {
        const query = Object.assign({ isGroup: false, isClinic: false }, queryFind);
        if (query.findAll) {
            delete query.isGroup;
            delete query.isClinic;
            delete query.findAll;
        }
        const whereInit = {
            AND: [
                ...(companyId
                    ? [
                        Object.assign({ OR: [
                                { id: companyId },
                                {
                                    receivingServiceContracts: {
                                        some: { applyingServiceCompanyId: companyId },
                                    },
                                },
                                ...(query.isClinic ? [{ companiesToClinicAvailable: { some: { companyId } } }] : []),
                            ] }, options === null || options === void 0 ? void 0 : options.where),
                    ]
                    : []),
            ],
        };
        if (!options.orderBy)
            options.orderBy = {
                name: 'asc',
            };
        if (!options.select)
            options.select = {
                id: true,
                name: true,
                status: true,
                group: { select: { id: true, name: true } },
                cnpj: true,
                fantasy: true,
                initials: true,
                isConsulting: true,
                address: true,
            };
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: [
                'search',
                'userId',
                'groupId',
                'companiesIds',
                'clinicsCompanyId',
                'clinicExamsIds',
                'isPeriodic',
                'isChange',
                'isAdmission',
                'selectReport',
                'isReturn',
                'isDismissal',
                'findAll',
            ],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [
                    { group: { name: { contains: query.search, mode: 'insensitive' } } },
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { fantasy: { contains: query.search, mode: 'insensitive' } },
                    { initials: { contains: query.search, mode: 'insensitive' } },
                    {
                        cnpj: {
                            contains: query.search ? (0, brazilian_utils_1.onlyNumbers)(query.search) || 'no' : '',
                        },
                    },
                ],
            });
        }
        if ('userId' in query) {
            where.AND.push({
                users: { some: { userId: query.userId } },
            });
        }
        if ('groupId' in query) {
            where.AND.push({
                group: { id: query.groupId },
            });
        }
        if ('companiesIds' in query) {
            where.AND.push({
                id: { in: query.companiesIds },
            });
        }
        if ('clinicsCompanyId' in query) {
            where.AND.push({
                clinicsAvailable: { some: { companyId: query.clinicsCompanyId } },
            });
        }
        if ('clinicExamsIds' in query) {
            where.AND.push({
                clinicExams: {
                    some: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ examId: { in: query.clinicExamsIds } }, ('isPeriodic' in query && { isPeriodic: query === null || query === void 0 ? void 0 : query.isPeriodic })), ('isChange' in query && { isChange: query === null || query === void 0 ? void 0 : query.isChange })), ('isAdmission' in query && { isAdmission: query === null || query === void 0 ? void 0 : query.isAdmission })), ('isReturn' in query && { isReturn: query === null || query === void 0 ? void 0 : query.isReturn })), ('isDismissal' in query && { isDismissal: query === null || query === void 0 ? void 0 : query.isDismissal })),
                },
            });
        }
        if ('selectReport' in query) {
            options.select.esocialStart = true;
            options.select.esocialSend = true;
            options.select.report = true;
            options.orderBy = [{ report: { esocialReject: 'desc' } }, { report: { esocialPendent: 'desc' } }];
        }
        const response = await this.prisma.$transaction([
            this.prisma.company.count({
                where,
            }),
            this.prisma.company.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0 })),
        ]);
        return {
            data: response[1].map((company) => new company_entity_1.CompanyEntity(company)),
            count: response[0],
        };
    }
    async findAll(query, pagination, options = {}) {
        const whereInit = { AND: [] };
        if (query.findAll) {
            delete query.isGroup;
            delete query.isClinic;
            delete query.findAll;
        }
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: [
                'search',
                'userId',
                'groupId',
                'companiesIds',
                'clinicsCompanyId',
                'clinicExamsIds',
                'isPeriodic',
                'isChange',
                'isAdmission',
                'isReturn',
                'isDismissal',
                'findAll',
            ],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [
                    { group: { name: { contains: query.search, mode: 'insensitive' } } },
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { initials: { contains: query.search, mode: 'insensitive' } },
                    { unit: { contains: query.search, mode: 'insensitive' } },
                    {
                        cnpj: {
                            contains: query.search ? (0, brazilian_utils_1.onlyNumbers)(query.search) || 'no' : '',
                        },
                    },
                ],
            });
        }
        if ('userId' in query) {
            where.AND.push({
                users: { some: { userId: query.userId } },
            });
        }
        if ('groupId' in query) {
            where.AND.push({
                group: { id: query.groupId },
            });
        }
        if ('companiesIds' in query) {
            where.AND.push({
                id: { in: query.companiesIds },
            });
        }
        if ('clinicsCompanyId' in query) {
            where.AND.push({
                clinicsAvailable: { some: { companyId: query.clinicsCompanyId } },
            });
        }
        if ('clinicExamsIds' in query) {
            where.AND.push({
                clinicExams: {
                    some: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ examId: { in: query.clinicExamsIds } }, ('isPeriodic' in query && { isPeriodic: query === null || query === void 0 ? void 0 : query.isPeriodic })), ('isChange' in query && { isChange: query === null || query === void 0 ? void 0 : query.isChange })), ('isAdmission' in query && { isAdmission: query === null || query === void 0 ? void 0 : query.isAdmission })), ('isReturn' in query && { isReturn: query === null || query === void 0 ? void 0 : query.isReturn })), ('isDismissal' in query && { isDismissal: query === null || query === void 0 ? void 0 : query.isDismissal })),
                },
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.company.count({
                where,
            }),
            this.prisma.company.findMany(Object.assign(Object.assign({}, options), { where, include: Object.assign({ workspace: { include: { address: true } }, doctorResponsible: { include: { professional: true } }, group: true, tecResponsible: { include: { professional: true } }, address: true, contacts: { where: { isPrincipal: true } } }, options === null || options === void 0 ? void 0 : options.include), take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { name: 'asc' } })),
        ]);
        return {
            data: response[1].map((company) => new company_entity_1.CompanyEntity(company)),
            count: response[0],
        };
    }
    async findById(id, options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const employeeCount = await this.prisma.employee.count({
            where: { companyId: id, hierarchyId: { not: null } },
        });
        const riskGroupCount = await this.prisma.riskFactorGroupData.count({
            where: { companyId: id },
        });
        const hierarchyCount = await this.prisma.hierarchy.count({
            where: { companyId: id },
        });
        const homogenousGroupCount = await this.prisma.homogeneousGroup.count({
            where: { companyId: id },
        });
        const professionalCount = await this.prisma.professional.count({
            where: { companyId: id },
        });
        const examCount = await this.prisma.examToClinic.count({
            where: { companyId: id },
        });
        const usersCount = await this.prisma.userCompany.count({
            where: { companyId: id },
        });
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: Object.assign(Object.assign({}, include), { group: {
                    include: {
                        doctorResponsible: { include: { professional: true } },
                        tecResponsible: { include: { professional: true } },
                    },
                }, primary_activity: !!(include === null || include === void 0 ? void 0 : include.primary_activity), secondary_activity: !!(include === null || include === void 0 ? void 0 : include.secondary_activity), workspace: !!(include === null || include === void 0 ? void 0 : include.workspace) ? { include: { address: true } } : false, employees: !!include.employees ? true : false, address: true, doctorResponsible: { include: { professional: true } }, tecResponsible: { include: { professional: true } } }),
        });
        if (company === null || company === void 0 ? void 0 : company.workspace) {
            company.workspace = await Promise.all(company.workspace.map(async (workspace) => {
                const employeeCount = await this.prisma.employee.count({
                    where: {
                        OR: [
                            { hierarchy: { workspaces: { some: { id: workspace.id } } } },
                        ],
                    },
                });
                return Object.assign(Object.assign({}, workspace), { employeeCount });
            }));
        }
        return new company_entity_1.CompanyEntity(Object.assign(Object.assign({}, company), { employeeCount: employeeCount, riskGroupCount: riskGroupCount, homogenousGroupCount,
            hierarchyCount,
            professionalCount,
            examCount,
            usersCount }));
    }
    async findNude(options = {}) {
        const data = await this.prisma.company.findMany(Object.assign({}, options));
        return data.map((data) => new company_entity_1.CompanyEntity(data));
    }
    async findFirstNude(options = {}) {
        const data = await this.prisma.company.findFirst(Object.assign({}, options));
        return new company_entity_1.CompanyEntity(data);
    }
    async countRelations(id, options) {
        const riskGroupCount = await this.prisma.riskFactorGroupData.count({
            where: { companyId: id },
        });
        const hierarchyCount = await this.prisma.hierarchy.count({
            where: { companyId: id },
        });
        const homogenousGroupCount = await this.prisma.homogeneousGroup.count({
            where: { companyId: id },
        });
        return {
            riskGroupCount: riskGroupCount,
            homogenousGroupCount,
            hierarchyCount,
        };
    }
};
CompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyRepository);
exports.CompanyRepository = CompanyRepository;
//# sourceMappingURL=CompanyRepository.js.map