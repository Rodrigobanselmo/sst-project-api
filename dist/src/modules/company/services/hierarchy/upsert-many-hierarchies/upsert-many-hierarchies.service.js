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
exports.UpsertManyHierarchyService = void 0;
const EmployeeRepository_1 = require("./../../../repositories/implementations/EmployeeRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const HierarchyRepository_1 = require("../../../../../modules/company/repositories/implementations/HierarchyRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let UpsertManyHierarchyService = class UpsertManyHierarchyService {
    constructor(hierarchyRepository, employeeRepository) {
        this.hierarchyRepository = hierarchyRepository;
        this.employeeRepository = employeeRepository;
    }
    async execute(hierarchies, user) {
        await Promise.all(hierarchies.map(async (hierarchy) => {
            var _a;
            if (hierarchy.parentId && [client_1.HierarchyEnum.DIRECTORY].includes(hierarchy.type)) {
                throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.UPDATE_HIERARCHY_WITH_PARENT);
            }
            if (!hierarchy.parentId && [client_1.HierarchyEnum.SUB_SECTOR, client_1.HierarchyEnum.SUB_OFFICE].includes(hierarchy.type)) {
                throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.UPSERT_HIERARCHY_WITH_PARENT);
            }
            if (hierarchy.type === client_1.HierarchyEnum.SUB_OFFICE) {
                const employeeFound = await this.employeeRepository.findFirstNude({
                    where: {
                        id: { in: hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.employeesIds },
                        hierarchyId: { notIn: [hierarchy.parentId] },
                    },
                });
                if (employeeFound === null || employeeFound === void 0 ? void 0 : employeeFound.id) {
                    throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.UPSERT_HIERARCHY_WITH_SUB_OFFICE_OTHER_OFFICE);
                }
                return;
            }
            if (((_a = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.employeesIds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const employeeFound = await this.employeeRepository.findFirstNude({
                    where: {
                        id: { in: hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.employeesIds },
                        subOffices: {
                            some: { status: { equals: 'ACTIVE' } },
                        },
                        hierarchyId: { notIn: [hierarchy.id] },
                    },
                });
                if (employeeFound === null || employeeFound === void 0 ? void 0 : employeeFound.id) {
                    throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.UPSERT_HIERARCHY_WITH_EMPLOYEE_WITH_SUB_OFFICE);
                }
            }
        }));
        const allHierarchy = await this.hierarchyRepository.upsertMany(hierarchies, user.targetCompanyId);
        return allHierarchy;
    }
};
UpsertManyHierarchyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HierarchyRepository_1.HierarchyRepository, EmployeeRepository_1.EmployeeRepository])
], UpsertManyHierarchyService);
exports.UpsertManyHierarchyService = UpsertManyHierarchyService;
//# sourceMappingURL=upsert-many-hierarchies.service.js.map