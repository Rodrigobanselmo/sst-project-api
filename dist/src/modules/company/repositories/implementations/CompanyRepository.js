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
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const company_entity_1 = require("../../entities/company.entity");
const uuid_1 = require("uuid");
let CompanyRepository = class CompanyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var { workspace = [], primary_activity = [], secondary_activity = [], license, address, companyId } = _a, createCompanyDto = __rest(_a, ["workspace", "primary_activity", "secondary_activity", "license", "address", "companyId"]);
        const companyUUId = (0, uuid_1.v4)();
        const isReceivingService = !!companyId;
        const company = await this.prisma.company.create({
            data: Object.assign(Object.assign({ id: companyUUId }, createCompanyDto), { license: {
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
                    : undefined }),
            include: {
                workspace: { include: { address: true } },
                primary_activity: true,
                secondary_activity: true,
                license: true,
                address: true,
            },
        });
        return new company_entity_1.CompanyEntity(company);
    }
    async update(_a, options, prismaRef) {
        var { secondary_activity = [], primary_activity = [], workspace = [], employees = [], users = [], address, license, companyId } = _a, updateCompanyDto = __rest(_a, ["secondary_activity", "primary_activity", "workspace", "employees", "users", "address", "license", "companyId"]);
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const companyPrisma = this.prisma.company.update({
            where: { id: companyId },
            data: Object.assign(Object.assign({}, updateCompanyDto), { users: {
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
                            var { id, hierarchyId, workspaceIds } = _a, rest = __rest(_a, ["id", "hierarchyId", "workspaceIds"]);
                            return {
                                create: Object.assign(Object.assign({}, rest), { hierarchy: hierarchyId
                                        ? {
                                            connect: {
                                                id_companyId: { companyId, id: hierarchyId },
                                            },
                                        }
                                        : undefined, workspaces: workspaceIds
                                        ? {
                                            connect: workspaceIds.map((workspaceId) => ({
                                                id_companyId: { companyId, id: workspaceId },
                                            })),
                                        }
                                        : undefined }),
                                update: Object.assign(Object.assign({}, rest), { hierarchy: hierarchyId
                                        ? {
                                            connect: {
                                                id_companyId: { companyId, id: hierarchyId },
                                            },
                                        }
                                        : undefined, workspaces: workspaceIds
                                        ? {
                                            set: workspaceIds.map((workspaceId) => ({
                                                id_companyId: { companyId, id: workspaceId },
                                            })),
                                        }
                                        : undefined }),
                                where: { id_companyId: { companyId, id: id || -1 } },
                            };
                        }),
                    ],
                }, workspace: {
                    upsert: [
                        ...workspace.map((_a) => {
                            var { id, address } = _a, work = __rest(_a, ["id", "address"]);
                            return ({
                                create: Object.assign(Object.assign({}, work), { address: { create: address } }),
                                update: Object.assign(Object.assign({}, work), { address: { update: address } }),
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
                    connect: [
                        ...secondary_activity.map((activity) => ({ code: activity.code })),
                    ],
                } }),
            include: {
                workspace: include.workspace ? { include: { address: true } } : false,
                primary_activity: !!include.primary_activity,
                secondary_activity: !!include.secondary_activity,
                license: !!include.license,
                users: !!include.users,
                employees: !!include.employees
                    ? { include: { workspaces: true } }
                    : false,
            },
        });
        if (prismaRef)
            return companyPrisma;
        return new company_entity_1.CompanyEntity(await companyPrisma);
    }
    async upsertMany(updateCompanyDto, options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const data = await this.prisma.$transaction(updateCompanyDto.map((_a) => {
            var { secondary_activity = [], primary_activity = [], employees = [], workspace = [], address, id, users, license } = _a, upsertRiskDto = __rest(_a, ["secondary_activity", "primary_activity", "employees", "workspace", "address", "id", "users", "license"]);
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
                    workspace: include.workspace
                        ? { include: { address: true } }
                        : false,
                    primary_activity: !!include.primary_activity,
                    secondary_activity: !!include.secondary_activity,
                    license: !!include.license,
                    users: !!include.users,
                    employees: !!include.employees
                        ? { include: { workspaces: true } }
                        : false,
                },
            });
        }));
        return data.map((company) => new company_entity_1.CompanyEntity(company));
    }
    async updateDisconnect(_a) {
        var { secondary_activity = [], primary_activity = [], workspace = [], employees = [], license, users = [], address, companyId } = _a, updateCompanyDto = __rest(_a, ["secondary_activity", "primary_activity", "workspace", "employees", "license", "users", "address", "companyId"]);
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
                    disconnect: [
                        ...primary_activity.map((activity) => ({ code: activity.code })),
                    ],
                }, secondary_activity: {
                    disconnect: [
                        ...secondary_activity.map((activity) => ({ code: activity.code })),
                    ],
                } }),
            include: {
                workspace: { include: { address: true } },
                primary_activity: true,
                secondary_activity: true,
                license: true,
            },
        });
        return new company_entity_1.CompanyEntity(company);
    }
    async findById(id, options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const employeeCount = await this.prisma.employee.count({
            where: { companyId: id },
        });
        const riskGroupCount = await this.prisma.riskFactorGroupData.count({
            where: { companyId: id },
        });
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                primary_activity: !!(include === null || include === void 0 ? void 0 : include.primary_activity),
                secondary_activity: !!(include === null || include === void 0 ? void 0 : include.secondary_activity),
                workspace: !!(include === null || include === void 0 ? void 0 : include.workspace)
                    ? { include: { address: true } }
                    : false,
                employees: !!include.employees
                    ? { include: { workspaces: true } }
                    : false,
                address: true,
            },
        });
        if (company.workspace) {
            company.workspace = await Promise.all(company.workspace.map(async (workspace) => {
                const employeeCount = await this.prisma.employee.count({
                    where: { workspaces: { some: { id: workspace.id } } },
                });
                return Object.assign(Object.assign({}, workspace), { employeeCount });
            }));
        }
        return new company_entity_1.CompanyEntity(Object.assign(Object.assign({}, company), { employeeCount: employeeCount, riskGroupCount: riskGroupCount }));
    }
    async findAllRelatedByCompanyId(companyId, options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: {
                primary_activity: !!(include === null || include === void 0 ? void 0 : include.primary_activity),
                secondary_activity: !!(include === null || include === void 0 ? void 0 : include.secondary_activity),
                workspace: { include: { address: true } },
            },
        });
        const companies = await this.prisma.contract.findMany({
            where: { applyingServiceCompanyId: companyId },
            include: {
                receivingServiceCompany: true,
            },
        });
        return [
            new company_entity_1.CompanyEntity(company),
            ...companies.map((applyingServiceCompany) => new company_entity_1.CompanyEntity(applyingServiceCompany.receivingServiceCompany)),
        ];
    }
    async findAll(options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const companies = await this.prisma.company.findMany({
            include: {
                primary_activity: !!(include === null || include === void 0 ? void 0 : include.primary_activity),
                secondary_activity: !!(include === null || include === void 0 ? void 0 : include.secondary_activity),
                workspace: { include: { address: true } },
            },
        });
        return [...companies.map((company) => new company_entity_1.CompanyEntity(company))];
    }
};
CompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyRepository);
exports.CompanyRepository = CompanyRepository;
//# sourceMappingURL=CompanyRepository.js.map