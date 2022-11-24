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
exports.CreateSubHierarchyService = void 0;
const EmployeeRepository_1 = require("./../../../repositories/implementations/EmployeeRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const HierarchyRepository_1 = require("../../../repositories/implementations/HierarchyRepository");
let CreateSubHierarchyService = class CreateSubHierarchyService {
    constructor(hierarchyRepository, employeeRepository) {
        this.hierarchyRepository = hierarchyRepository;
        this.employeeRepository = employeeRepository;
    }
    async execute(hierarchy, user) {
        const employees = await this.employeeRepository.findNude({
            select: {
                hierarchyId: true,
                id: true,
                hierarchy: {
                    select: {
                        workspaces: { select: { id: true } },
                        description: true,
                        id: true,
                    },
                },
                hierarchyHistory: { orderBy: { startDate: 'desc' }, take: 1, select: { id: true } },
            },
            where: {
                companyId: user.targetCompanyId,
                id: { in: hierarchy.employeesIds || [] },
            },
        });
        const isEveryoneFromSameOffice = employees.every((employee) => employees.every((e) => (e.hierarchyId = employee === null || employee === void 0 ? void 0 : employee.hierarchyId)));
        if (!isEveryoneFromSameOffice)
            throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.EVERYONE_NOT_FROM_SAME_OFFICE);
        const office = employees[0].hierarchy;
        const workspaceIds = office.workspaces.map((workspace) => workspace.id);
        const hierarchySub = await this.hierarchyRepository.upsertSubOffice({
            companyId: user.targetCompanyId,
            name: hierarchy.name,
            status: hierarchy.status,
            parentId: hierarchy.parentId,
            employeesIds: employees.map((employee) => employee.id),
            realDescription: hierarchy.realDescription,
            description: office.description,
            type: client_1.HierarchyEnum.SUB_OFFICE,
            workspaceIds: workspaceIds,
            id: hierarchy.id,
            historyIds: employees.reduce((acc, employee) => {
                return [...acc, ...employee.hierarchyHistory.map((e) => e.id)];
            }, []),
        });
        return Object.assign(Object.assign({}, hierarchySub), { workspaceIds: workspaceIds });
    }
};
CreateSubHierarchyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HierarchyRepository_1.HierarchyRepository, EmployeeRepository_1.EmployeeRepository])
], CreateSubHierarchyService);
exports.CreateSubHierarchyService = CreateSubHierarchyService;
//# sourceMappingURL=create-sub-hierarchies.service.js.map