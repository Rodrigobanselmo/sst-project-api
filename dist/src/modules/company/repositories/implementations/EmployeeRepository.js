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
exports.EmployeeRepository = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const errorMessage_1 = require("../../../../shared/constants/enum/errorMessage");
const employee_entity_1 = require("../../entities/employee.entity");
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
let EmployeeRepository = class EmployeeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var { workspaceIds, hierarchyId, companyId, shiftId, cidId } = _a, createCompanyDto = __rest(_a, ["workspaceIds", "hierarchyId", "companyId", "shiftId", "cidId"]);
        try {
            const employee = await this.prisma.employee.create({
                data: Object.assign(Object.assign({}, createCompanyDto), { company: { connect: { id: companyId } }, hierarchy: hierarchyId
                        ? {
                            connect: { id: hierarchyId },
                        }
                        : undefined, shift: shiftId
                        ? {
                            connect: { id: shiftId },
                        }
                        : undefined, cid: cidId
                        ? {
                            connect: { cid: cidId },
                        }
                        : undefined }),
            });
            return new employee_entity_1.EmployeeEntity(employee);
        }
        catch (error) {
            if (error.code == 'P2002')
                throw new common_1.ConflictException(errorMessage_1.ErrorCompanyEnum.CPF_CONFLICT);
            throw new Error(error);
        }
    }
    async update(_a, removeSubOffices) {
        var { workspaceIds, hierarchyId, companyId, shiftId, cidId, id } = _a, createCompanyDto = __rest(_a, ["workspaceIds", "hierarchyId", "companyId", "shiftId", "cidId", "id"]);
        const employee = await this.prisma.employee.update({
            data: Object.assign(Object.assign({}, createCompanyDto), { hierarchy: !hierarchyId
                    ? undefined
                    : {
                        connect: { id: hierarchyId },
                    }, subOffices: removeSubOffices ? { set: [] } : undefined, shift: shiftId
                    ? {
                        connect: { id: shiftId },
                    }
                    : undefined, cid: cidId
                    ? {
                        connect: { cid: cidId },
                    }
                    : undefined }),
            where: { id_companyId: { companyId, id } },
        });
        return new employee_entity_1.EmployeeEntity(employee);
    }
    async updateNude(options) {
        const employee = await this.prisma.employee.update(options);
        return new employee_entity_1.EmployeeEntity(employee);
    }
    async upsertMany(upsertEmployeeMany, companyId) {
        const employeeHistory = await this.prisma.employeeHierarchyHistory.findMany({ where: { hierarchy: { companyId } }, include: { employee: true } });
        const data = await this.prisma.$transaction(upsertEmployeeMany.map((_a) => {
            var _b;
            var { companyId: _, id, workspaceIds, hierarchyId, shiftId, cidId, admissionDate } = _a, upsertEmployeeDto = __rest(_a, ["companyId", "id", "workspaceIds", "hierarchyId", "shiftId", "cidId", "admissionDate"]);
            return this.prisma.employee.upsert({
                create: Object.assign(Object.assign({}, upsertEmployeeDto), { company: { connect: { id: companyId } }, hierarchy: hierarchyId
                        ? {
                            connect: { id: hierarchyId },
                        }
                        : undefined, shift: shiftId
                        ? {
                            connect: { id: shiftId },
                        }
                        : undefined, cid: cidId
                        ? {
                            connect: { cid: cidId },
                        }
                        : undefined, status: 'ACTIVE', hierarchyHistory: hierarchyId
                        ? {
                            create: {
                                motive: 'ADM',
                                startDate: admissionDate,
                                hierarchyId: hierarchyId,
                            },
                        }
                        : undefined }),
                update: Object.assign(Object.assign({}, upsertEmployeeDto), { hierarchy: !hierarchyId
                        ? undefined
                        : {
                            connect: { id: hierarchyId },
                        }, shift: shiftId
                        ? {
                            connect: { id: shiftId },
                        }
                        : undefined, cid: cidId
                        ? {
                            connect: { cid: cidId },
                        }
                        : undefined, status: 'ACTIVE', hierarchyHistory: hierarchyId
                        ? {
                            upsert: {
                                where: {
                                    id: ((_b = employeeHistory.find(({ employee }) => employee.cpf === upsertEmployeeDto.cpf)) === null || _b === void 0 ? void 0 : _b.id) || -1,
                                },
                                create: {
                                    motive: 'ADM',
                                    startDate: admissionDate,
                                    hierarchyId: hierarchyId,
                                },
                                update: {
                                    motive: 'ADM',
                                    startDate: admissionDate,
                                    hierarchyId: hierarchyId,
                                },
                            },
                        }
                        : undefined }),
                where: { cpf_companyId: { companyId, cpf: upsertEmployeeDto.cpf } },
            });
        }));
        return data.map((employee) => new employee_entity_1.EmployeeEntity(employee));
    }
    async findById(id, companyId, options = {}) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const employee = await this.prisma.employee.findUnique({
            where: { id_companyId: { companyId, id } },
            include: Object.assign(Object.assign({}, include), { company: {
                    select: {
                        fantasy: true,
                        name: true,
                        cnpj: true,
                        initials: true,
                        blockResignationExam: true,
                        primary_activity: true,
                    },
                }, hierarchy: !!(include === null || include === void 0 ? void 0 : include.hierarchy) ? false : { select: this.parentInclude() } }),
        });
        return new employee_entity_1.EmployeeEntity(employee);
    }
    async find(query, pagination, options = {}) {
        const whereInit = Object.assign({ AND: [] }, options.where);
        options.orderBy = {
            name: 'asc',
        };
        options.select = Object.assign({ id: true, cpf: true, email: true, hierarchyId: true, name: true, companyId: true, status: true }, options === null || options === void 0 ? void 0 : options.select);
        if ('all' in query) {
            options.select.company = {
                select: { fantasy: true, name: true, cnpj: true, initials: true },
            };
            whereInit.AND.push({
                OR: [
                    { companyId: query.companyId, status: 'ACTIVE' },
                    {
                        company: {
                            receivingServiceContracts: {
                                some: { applyingServiceCompanyId: query.companyId },
                            },
                        },
                        status: 'ACTIVE',
                    },
                ],
            });
            delete query.companyId;
        }
        if ('expiredExam' in query) {
            options.orderBy = [{ expiredDateExam: 'asc' }, { name: 'asc' }];
            options.select.expiredDateExam = true;
            options.select.examsHistory = {
                select: {
                    status: true,
                    id: true,
                    doneDate: true,
                    evaluationType: true,
                    hierarchyId: true,
                    subOfficeId: true,
                    examType: true,
                    expiredDate: true,
                },
                where: {
                    exam: { isAttendance: true },
                    status: { in: ['PENDING', 'PROCESSING', 'DONE'] },
                },
                take: 1,
                orderBy: { created_at: 'desc' },
            };
        }
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search', 'hierarchySubOfficeId', 'all', 'expiredExam'],
        });
        if ('search' in query) {
            const OR = [];
            const CPF = (0, brazilian_utils_1.onlyNumbers)(query.search);
            const isCPF = CPF.length == 11;
            if (!isCPF) {
                OR.push({ name: { contains: query.search, mode: 'insensitive' } });
                OR.push({ email: { contains: query.search, mode: 'insensitive' } });
                OR.push({
                    esocialCode: { contains: query.search, mode: 'insensitive' },
                });
            }
            else {
                OR.push({
                    cpf: CPF,
                });
            }
            where.AND.push({ OR });
            delete query.search;
        }
        if ('hierarchySubOfficeId' in query) {
            where.AND.push({
                subOffices: { some: { id: query.hierarchySubOfficeId } },
            });
            delete query.hierarchySubOfficeId;
        }
        const response = await this.prisma.$transaction([
            this.prisma.employee.count({
                where,
            }),
            this.prisma.employee.findMany(Object.assign(Object.assign({ take: pagination.take || 20, skip: pagination.skip || 0 }, options), { where })),
        ]);
        return {
            data: response[1].map((employee) => new employee_entity_1.EmployeeEntity(employee)),
            count: response[0],
        };
    }
    async findEvent2220(query, pagination, options = {}) {
        const companyId = query.companyId;
        const whereInit = Object.assign({ AND: [
                {
                    hierarchyHistory: { some: { id: { gt: 0 } } },
                    examsHistory: {
                        some: {
                            doneDate: { gte: query.startDate },
                            sendEvent: true,
                            exam: { esocial27Code: { not: null } },
                            OR: [
                                { status: 'DONE' },
                                {
                                    status: 'CANCELED',
                                    AND: [
                                        {
                                            events: {
                                                every: { id: { gt: 0 }, action: { not: 'EXCLUDE' } },
                                            },
                                        },
                                        {
                                            events: {
                                                some: { id: { gt: 0 }, receipt: { not: null } },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            ] }, options.where);
        options.orderBy = {
            name: 'asc',
        };
        options.select = Object.assign({ id: true, companyId: true, cpf: true, esocialCode: true, examsHistory: {
                where: {
                    doneDate: { gte: query.startDate },
                    OR: [
                        { status: 'DONE' },
                        {
                            status: 'CANCELED',
                            AND: [
                                {
                                    events: {
                                        every: { id: { gt: 0 }, action: { not: 'EXCLUDE' } },
                                    },
                                },
                                {
                                    events: {
                                        some: { id: { gt: 0 }, receipt: { not: null } },
                                    },
                                },
                            ],
                        },
                    ],
                    exam: {
                        AND: [{ esocial27Code: { not: null } }, { esocial27Code: { not: '' } }],
                    },
                },
                orderBy: [{ doneDate: 'asc' }, { exam: { isAttendance: 'asc' } }],
                select: {
                    id: true,
                    examType: true,
                    evaluationType: true,
                    doneDate: true,
                    status: true,
                    employeeId: true,
                    sendEvent: true,
                    events: true,
                    doctor: {
                        include: { professional: { select: { name: true, cpf: true } } },
                    },
                    exam: {
                        select: {
                            id: true,
                            isAttendance: true,
                            esocial27Code: true,
                            obsProc: true,
                            name: true,
                        },
                    },
                },
            } }, options === null || options === void 0 ? void 0 : options.select);
        if ('all' in query) {
            options.select.company = {
                select: { fantasy: true, name: true, cnpj: true, initials: true },
            };
            whereInit.AND.push({
                OR: [
                    { companyId: query.companyId, status: 'ACTIVE' },
                    {
                        company: {
                            receivingServiceContracts: {
                                some: { applyingServiceCompanyId: companyId },
                            },
                        },
                        status: 'ACTIVE',
                    },
                ],
            });
            delete query.companyId;
        }
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search', 'companiesIds', 'startDate', 'all'],
        });
        if ('search' in query) {
            const OR = [];
            const CPF = (0, brazilian_utils_1.onlyNumbers)(query.search);
            const isCPF = CPF.length == 11;
            if (!isCPF) {
                OR.push({ name: { contains: query.search, mode: 'insensitive' } });
                OR.push({ email: { contains: query.search, mode: 'insensitive' } });
                OR.push({
                    esocialCode: { contains: query.search, mode: 'insensitive' },
                });
            }
            else {
                OR.push({
                    cpf: CPF,
                });
            }
            where.AND.push({ OR });
            delete query.search;
        }
        if ('companiesIds' in query) {
            where.AND.push({
                companyId: { in: query.companiesIds },
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.employee.count({
                where,
            }),
            this.prisma.employee.findMany(Object.assign(Object.assign({ take: pagination.take || 20, skip: pagination.skip || 0 }, options), { where })),
        ]);
        return {
            data: response[1].map((employee) => new employee_entity_1.EmployeeEntity(employee)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const employees = await this.prisma.employee.findMany(Object.assign({}, options));
        return employees.map((employee) => new employee_entity_1.EmployeeEntity(employee));
    }
    async countNude(options = {}) {
        const employees = await this.prisma.employee.count(Object.assign({}, options));
        return employees;
    }
    async findOnlyCountNude(options = {}) {
        const count = await this.prisma.employee.count({
            where: options.where,
        });
        return count;
    }
    async findCountNude(options = {}, pagination) {
        const response = await this.prisma.$transaction([
            this.prisma.employee.count({
                where: options.where,
            }),
            this.prisma.employee.findMany(Object.assign({ take: pagination.take || 20, skip: pagination.skip || 0 }, options)),
        ]);
        return {
            data: response[1].map((employee) => new employee_entity_1.EmployeeEntity(employee)),
            count: response[0],
        };
    }
    async findFirstNude(options = {}) {
        const employee = await this.prisma.employee.findFirst(Object.assign({}, options));
        return new employee_entity_1.EmployeeEntity(employee);
    }
    async disconnectSubOffices(employeesIds, companyId) {
        const response = await this.prisma.$transaction([
            ...employeesIds.map((id) => {
                return this.prisma.employee.update({
                    data: {
                        subOffices: { set: [] },
                    },
                    where: { id_companyId: { companyId, id } },
                });
            }),
        ]);
        return response.map((employee) => new employee_entity_1.EmployeeEntity(employee));
    }
    async disconnectUniqueSubOffice(employeeId, subOfficeId, companyId) {
        const employee = await this.prisma.employee.update({
            data: {
                subOffices: { disconnect: { id: subOfficeId } },
            },
            where: { id_companyId: { companyId, id: employeeId } },
        });
        return new employee_entity_1.EmployeeEntity(employee);
    }
    parentInclude() {
        const objectSelect = (children) => {
            return {
                parent: Object.assign({}, (children && { select: Object.assign({}, children) })),
                id: true,
                name: true,
                parentId: true,
                status: true,
                type: true,
            };
        };
        return objectSelect(objectSelect(objectSelect(objectSelect(objectSelect()))));
    }
};
EmployeeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeRepository);
exports.EmployeeRepository = EmployeeRepository;
//# sourceMappingURL=EmployeeRepository.js.map