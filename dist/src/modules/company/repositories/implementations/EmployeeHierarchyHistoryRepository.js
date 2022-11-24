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
exports.EmployeeHierarchyHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const employee_hierarchy_history_entity_1 = require("../../entities/employee-hierarchy-history.entity");
const transformStringToObject_1 = require("./../../../../shared/utils/transformStringToObject");
let EmployeeHierarchyHistoryRepository = class EmployeeHierarchyHistoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a, employeeId, hierarchyId) {
        var { subOfficeId } = _a, createData = __rest(_a, ["subOfficeId"]);
        const status = createData.motive === 'DEM' ? 'INACTIVE' : 'ACTIVE';
        const response = await this.prisma.$transaction([
            this.prisma.employeeHierarchyHistory.create({
                data: Object.assign(Object.assign({}, createData), (subOfficeId && {
                    subHierarchies: { connect: { id: subOfficeId } },
                })),
            }),
            this.prisma.employee.update({
                data: hierarchyId !== undefined
                    ? Object.assign(Object.assign({ hierarchyId,
                        status }, (subOfficeId && {
                        subOffices: { connect: { id: subOfficeId } },
                    })), (!subOfficeId && {
                        subOffices: { set: [] },
                    })) : { status },
                where: { id: employeeId },
            }),
        ]);
        return new employee_hierarchy_history_entity_1.EmployeeHierarchyHistoryEntity(response[0]);
    }
    async update(_a, employeeId, hierarchyId) {
        var { id, subOfficeId } = _a, updateData = __rest(_a, ["id", "subOfficeId"]);
        const status = updateData.motive === 'DEM' ? 'INACTIVE' : 'ACTIVE';
        const response = await this.prisma.$transaction([
            this.prisma.employeeHierarchyHistory.update({
                data: Object.assign(Object.assign(Object.assign({}, updateData), (subOfficeId && {
                    subHierarchies: { connect: { id: subOfficeId } },
                })), (!subOfficeId && {
                    subHierarchies: { set: [] },
                })),
                where: { id },
            }),
            this.prisma.employee.update({
                data: hierarchyId !== undefined
                    ? Object.assign(Object.assign({ hierarchyId,
                        status }, (subOfficeId && {
                        subOffices: { connect: { id: subOfficeId } },
                    })), (!subOfficeId && {
                        subOffices: { set: [] },
                    })) : { status },
                where: { id: employeeId },
            }),
        ]);
        return new employee_hierarchy_history_entity_1.EmployeeHierarchyHistoryEntity(response[0]);
    }
    async find(query, pagination, options = {}) {
        const whereInit = {
            AND: [
                {
                    hierarchy: { companyId: query.companyId },
                },
            ],
        };
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['companyId'],
        });
        const optionsFind = (0, transformStringToObject_1.transformStringToObject)(Array.from({ length: 5 })
            .map(() => 'include.parent')
            .join('.'), true);
        const response = await this.prisma.$transaction([
            this.prisma.employeeHierarchyHistory.count({
                where,
            }),
            this.prisma.employeeHierarchyHistory.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, include: {
                    subHierarchies: { select: { id: true, name: true } },
                    hierarchy: {
                        include: Object.assign({ company: { select: { initials: true, name: true } } }, optionsFind.include),
                    },
                }, orderBy: { startDate: 'desc' } })),
        ]);
        return {
            data: response[1].map((data) => new employee_hierarchy_history_entity_1.EmployeeHierarchyHistoryEntity(data)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const data = await this.prisma.employeeHierarchyHistory.findMany(Object.assign({}, options));
        return data.map((data) => new employee_hierarchy_history_entity_1.EmployeeHierarchyHistoryEntity(data));
    }
    async findFirstNude(options = {}) {
        const data = await this.prisma.employeeHierarchyHistory.findFirst(Object.assign({}, options));
        return new employee_hierarchy_history_entity_1.EmployeeHierarchyHistoryEntity(data);
    }
    async delete(id, employeeId, hierarchyId) {
        const response = await this.prisma.$transaction([
            this.prisma.employeeHierarchyHistory.delete({
                where: { id },
            }),
            this.prisma.employee.update({
                data: hierarchyId !== undefined ? { hierarchyId, status: 'ACTIVE' } : {},
                where: { id: employeeId },
            }),
        ]);
        return new employee_hierarchy_history_entity_1.EmployeeHierarchyHistoryEntity(response[0]);
    }
};
EmployeeHierarchyHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeHierarchyHistoryRepository);
exports.EmployeeHierarchyHistoryRepository = EmployeeHierarchyHistoryRepository;
//# sourceMappingURL=EmployeeHierarchyHistoryRepository.js.map