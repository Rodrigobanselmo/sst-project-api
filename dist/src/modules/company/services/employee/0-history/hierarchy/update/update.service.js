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
exports.UpdateEmployeeHierarchyHistoryService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../../../repositories/implementations/EmployeePPPHistoryRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const errorMessage_1 = require("./../../../../../../../shared/constants/enum/errorMessage");
const EmployeeHierarchyHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository");
const EmployeeRepository_1 = require("../../../../../repositories/implementations/EmployeeRepository");
const create_service_1 = require("../create/create.service");
let UpdateEmployeeHierarchyHistoryService = class UpdateEmployeeHierarchyHistoryService {
    constructor(employeeHierarchyHistoryRepository, employeeRepository, employeePPPHistoryRepository, createEmployeeHierarchyHistoryService) {
        this.employeeHierarchyHistoryRepository = employeeHierarchyHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
        this.createEmployeeHierarchyHistoryService = createEmployeeHierarchyHistoryService;
    }
    async execute(dataDto, user) {
        const found = await this.employeeRepository.findById(dataDto.employeeId, user.targetCompanyId);
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
        const { hierarchyId, beforeHistory } = await this.createEmployeeHierarchyHistoryService.check({
            dataDto,
            foundEmployee: found,
        });
        if (dataDto.motive === client_1.EmployeeHierarchyMotiveTypeEnum.DEM)
            dataDto.hierarchyId = beforeHistory.hierarchyId;
        const history = await this.employeeHierarchyHistoryRepository.update(Object.assign({}, dataDto), found.id, hierarchyId);
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
};
UpdateEmployeeHierarchyHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeHierarchyHistoryRepository_1.EmployeeHierarchyHistoryRepository,
        EmployeeRepository_1.EmployeeRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository,
        create_service_1.CreateEmployeeHierarchyHistoryService])
], UpdateEmployeeHierarchyHistoryService);
exports.UpdateEmployeeHierarchyHistoryService = UpdateEmployeeHierarchyHistoryService;
//# sourceMappingURL=update.service.js.map