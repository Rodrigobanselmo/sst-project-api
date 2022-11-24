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
exports.CreateEmployeeHierarchyHistoryService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../../../repositories/implementations/EmployeePPPHistoryRepository");
const data_sort_1 = require("./../../../../../../../shared/utils/sorts/data.sort");
const employee_hierarchy_history_entity_1 = require("./../../../../../entities/employee-hierarchy-history.entity");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const errorMessage_1 = require("./../../../../../../../shared/constants/enum/errorMessage");
const EmployeeHierarchyHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository");
const EmployeeRepository_1 = require("../../../../../repositories/implementations/EmployeeRepository");
let CreateEmployeeHierarchyHistoryService = class CreateEmployeeHierarchyHistoryService {
    constructor(employeeHierarchyHistoryRepository, employeeRepository, employeePPPHistoryRepository) {
        this.employeeHierarchyHistoryRepository = employeeHierarchyHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(dataDto, user) {
        const found = await this.employeeRepository.findById(dataDto.employeeId, user.targetCompanyId);
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
        const { hierarchyId, beforeHistory } = await this.check({
            dataDto,
            foundEmployee: found,
        });
        if (dataDto.motive === client_1.EmployeeHierarchyMotiveTypeEnum.DEM)
            dataDto.hierarchyId = beforeHistory.hierarchyId;
        const history = await this.employeeHierarchyHistoryRepository.create(Object.assign({}, dataDto), found.id, hierarchyId);
        this.employeePPPHistoryRepository.updateManyNude({
            data: { sendEvent: true },
            where: {
                employee: {
                    companyId: user.targetCompanyId,
                    id: dataDto.employeeId,
                },
            },
        });
        return history;
    }
    async check({ dataDto, foundEmployee }) {
        if (!dataDto.startDate)
            throw new common_1.BadRequestException('missing start date');
        let afterMotive;
        {
            const afterHistory = (await this.employeeHierarchyHistoryRepository.findNude({
                where: {
                    employeeId: foundEmployee.id,
                    startDate: { gte: dataDto.startDate },
                },
                orderBy: { startDate: 'asc' },
                take: 3,
            }))
                .sort((a, b) => (0, data_sort_1.sortData)(a.created_at, b.created_at))
                .sort((a, b) => (0, data_sort_1.sortData)(a.startDate, b.startDate))[0];
            afterMotive = (afterHistory === null || afterHistory === void 0 ? void 0 : afterHistory.motive) || null;
            const isAfterOk = employee_hierarchy_history_entity_1.historyRules[dataDto.motive].after.includes(afterMotive);
            if (!isAfterOk)
                throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY);
        }
        let beforeMotive;
        let beforeHistory;
        {
            beforeHistory = (await this.employeeHierarchyHistoryRepository.findNude({
                where: {
                    employeeId: foundEmployee.id,
                    startDate: { lte: dataDto.startDate },
                },
                orderBy: { startDate: 'desc' },
                take: 3,
            }))
                .sort((a, b) => (0, data_sort_1.sortData)(b.created_at, a.created_at))
                .sort((a, b) => (0, data_sort_1.sortData)(b.startDate, a.startDate))[0];
            beforeMotive = (beforeHistory === null || beforeHistory === void 0 ? void 0 : beforeHistory.motive) || null;
            const isBeforeOk = employee_hierarchy_history_entity_1.historyRules[dataDto.motive].before.includes(beforeMotive);
            if (!isBeforeOk)
                throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY);
        }
        const getActualEmployeeHierarchy = () => {
            if (afterMotive === null) {
                if (dataDto.motive === client_1.EmployeeHierarchyMotiveTypeEnum.DEM)
                    return null;
                if (dataDto.hierarchyId)
                    return dataDto.hierarchyId;
                if (!dataDto.hierarchyId)
                    throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_MISSING_HIERARCHY);
            }
            return undefined;
        };
        const hierarchyId = getActualEmployeeHierarchy();
        return { hierarchyId, beforeHistory };
    }
};
CreateEmployeeHierarchyHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeHierarchyHistoryRepository_1.EmployeeHierarchyHistoryRepository,
        EmployeeRepository_1.EmployeeRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], CreateEmployeeHierarchyHistoryService);
exports.CreateEmployeeHierarchyHistoryService = CreateEmployeeHierarchyHistoryService;
//# sourceMappingURL=create.service.js.map