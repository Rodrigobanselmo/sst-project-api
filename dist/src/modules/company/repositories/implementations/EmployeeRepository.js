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
const common_1 = require("@nestjs/common");
const transformStringToObject_1 = require("../../../../shared/utils/transformStringToObject");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const employee_entity_1 = require("../../entities/employee.entity");
let EmployeeRepository = class EmployeeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var { workplaceId, hierarchyId, companyId } = _a, createCompanyDto = __rest(_a, ["workplaceId", "hierarchyId", "companyId"]);
        const employee = await this.prisma.employee.create({
            data: Object.assign(Object.assign({}, createCompanyDto), { company: { connect: { id: companyId } }, workplace: {
                    connect: { id_companyId: { companyId, id: workplaceId } },
                }, hierarchy: {
                    connect: { id: hierarchyId },
                } }),
        });
        return new employee_entity_1.EmployeeEntity(employee);
    }
    async update(_a) {
        var { workplaceId, hierarchyId, companyId, id } = _a, createCompanyDto = __rest(_a, ["workplaceId", "hierarchyId", "companyId", "id"]);
        const employee = await this.prisma.employee.update({
            data: Object.assign(Object.assign({}, createCompanyDto), { workplace: !workplaceId
                    ? undefined
                    : {
                        connect: { id_companyId: { companyId, id: workplaceId } },
                    }, hierarchy: !hierarchyId
                    ? undefined
                    : {
                        connect: { id: hierarchyId },
                    } }),
            where: { id_companyId: { companyId, id } },
        });
        return new employee_entity_1.EmployeeEntity(employee);
    }
    async upsertMany(upsertEmployeeMany, companyId) {
        const data = await this.prisma.$transaction(upsertEmployeeMany.map((_a) => {
            var { companyId: _, id, workplaceId, hierarchyId } = _a, upsertEmployeeDto = __rest(_a, ["companyId", "id", "workplaceId", "hierarchyId"]);
            return this.prisma.employee.upsert({
                create: Object.assign(Object.assign({}, upsertEmployeeDto), { company: { connect: { id: companyId } }, workplace: {
                        connect: { id_companyId: { companyId, id: workplaceId } },
                    }, hierarchy: {
                        connect: { id: hierarchyId },
                    } }),
                update: Object.assign(Object.assign({}, upsertEmployeeDto), { workplace: !workplaceId
                        ? undefined
                        : {
                            connect: { id_companyId: { companyId, id: workplaceId } },
                        }, hierarchy: !hierarchyId
                        ? undefined
                        : {
                            connect: { id: hierarchyId },
                        } }),
                where: { id_companyId: { companyId, id: id || -1 } },
            });
        }));
        return data.map((employee) => new employee_entity_1.EmployeeEntity(employee));
    }
    async findById(id, companyId, options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const employee = await this.prisma.employee.findUnique({
            where: { id_companyId: { companyId, id } },
            include: {
                company: !!(include === null || include === void 0 ? void 0 : include.company),
                hierarchy: !!(include === null || include === void 0 ? void 0 : include.hierarchy)
                    ? false
                    : Object.assign({}, (0, transformStringToObject_1.transformStringToObject)(Array.from({ length: 6 })
                        .map(() => 'include.parent')
                        .join('.'), true)),
            },
        });
        return new employee_entity_1.EmployeeEntity(employee);
    }
    async findAllByCompany(companyId, options) {
        const include = (options === null || options === void 0 ? void 0 : options.include) || {};
        const employees = await this.prisma.employee.findMany({
            where: { companyId },
            include: {
                hierarchy: (include === null || include === void 0 ? void 0 : include.hierarchy)
                    ? Object.assign({}, (0, transformStringToObject_1.transformStringToObject)(Array.from({ length: 6 })
                        .map(() => 'include.parent')
                        .join('.'), true)) : false,
            },
        });
        return employees.map((employee) => new employee_entity_1.EmployeeEntity(employee));
    }
};
EmployeeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeRepository);
exports.EmployeeRepository = EmployeeRepository;
//# sourceMappingURL=EmployeeRepository.js.map