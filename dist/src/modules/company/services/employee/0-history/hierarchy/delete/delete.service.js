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
exports.DeleteEmployeeHierarchyHistoryService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../../../repositories/implementations/EmployeePPPHistoryRepository");
const employee_hierarchy_history_entity_1 = require("./../../../../../entities/employee-hierarchy-history.entity");
const data_sort_1 = require("./../../../../../../../shared/utils/sorts/data.sort");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const errorMessage_1 = require("./../../../../../../../shared/constants/enum/errorMessage");
const EmployeeHierarchyHistoryRepository_1 = require("./../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository");
const EmployeeRepository_1 = require("./../../../../../repositories/implementations/EmployeeRepository");
let DeleteEmployeeHierarchyHistoryService = class DeleteEmployeeHierarchyHistoryService {
    constructor(employeeHierarchyHistoryRepository, employeeRepository, employeePPPHistoryRepository) {
        this.employeeHierarchyHistoryRepository = employeeHierarchyHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(id, employeeId, user) {
        const found = await this.employeeRepository.findById(employeeId, user.targetCompanyId);
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
        const hierarchyId = await this.check({ id, foundEmployee: found });
        const history = await this.employeeHierarchyHistoryRepository.delete(id, employeeId, hierarchyId);
        this.employeePPPHistoryRepository.updateManyNude({
            data: { sendEvent: true },
            where: {
                employee: {
                    companyId: user.targetCompanyId,
                    id: employeeId,
                },
            },
        });
        return history;
    }
    async check({ foundEmployee, id }) {
        var _a, _b, _c, _d;
        let afterHistory;
        let beforeHistory;
        {
            const allHistory = (await this.employeeHierarchyHistoryRepository.findNude({
                where: {
                    employeeId: foundEmployee.id,
                },
                orderBy: { startDate: 'asc' },
            }))
                .sort((a, b) => (0, data_sort_1.sortData)(a.created_at, b.created_at))
                .sort((a, b) => (0, data_sort_1.sortData)(a.startDate, b.startDate));
            const actualHistoryIndex = allHistory.findIndex((history) => history.id === id);
            if (actualHistoryIndex === -1)
                throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);
            afterHistory = allHistory[actualHistoryIndex + 1];
            beforeHistory = allHistory[actualHistoryIndex - 1];
            const afterMotive = (afterHistory === null || afterHistory === void 0 ? void 0 : afterHistory.motive) || null;
            const beforeMotive = (beforeHistory === null || beforeHistory === void 0 ? void 0 : beforeHistory.motive) || null;
            const isAfterOk = (_b = (_a = employee_hierarchy_history_entity_1.historyRules[String(afterMotive)]) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.includes(beforeMotive);
            const isBeforeOk = (_d = (_c = employee_hierarchy_history_entity_1.historyRules[String(beforeMotive)]) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.includes(afterMotive);
            if (!isAfterOk || !isBeforeOk)
                throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY);
        }
        const getActualEmployeeHierarchy = () => {
            if (afterHistory === undefined) {
                if (beforeHistory.motive === client_1.EmployeeHierarchyMotiveTypeEnum.DEM)
                    return null;
                if (beforeHistory.hierarchyId)
                    return beforeHistory.hierarchyId;
                if (!beforeHistory.hierarchyId)
                    throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_MISSING_HIERARCHY);
            }
            return undefined;
        };
        const hierarchyId = getActualEmployeeHierarchy();
        return hierarchyId;
    }
};
DeleteEmployeeHierarchyHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeHierarchyHistoryRepository_1.EmployeeHierarchyHistoryRepository,
        EmployeeRepository_1.EmployeeRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], DeleteEmployeeHierarchyHistoryService);
exports.DeleteEmployeeHierarchyHistoryService = DeleteEmployeeHierarchyHistoryService;
//# sourceMappingURL=delete.service.js.map