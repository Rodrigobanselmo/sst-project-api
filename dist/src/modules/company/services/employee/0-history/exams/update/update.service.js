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
exports.UpdateEmployeeExamHistoryService = void 0;
const compareFieldValues_1 = require("./../../../../../../../shared/utils/compareFieldValues");
const errorMessage_1 = require("./../../../../../../../shared/constants/enum/errorMessage");
const common_1 = require("@nestjs/common");
const EmployeeRepository_1 = require("../../../../../repositories/implementations/EmployeeRepository");
const EmployeeExamsHistoryRepository_1 = require("./../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
let UpdateEmployeeExamHistoryService = class UpdateEmployeeExamHistoryService {
    constructor(employeeExamHistoryRepository, employeeRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.employeeRepository = employeeRepository;
    }
    async execute(dataDto, user) {
        const found = await this.employeeExamHistoryRepository.findFirstNude({
            where: {
                id: dataDto.id,
                employee: {
                    companyId: user.targetCompanyId,
                    id: dataDto.employeeId,
                },
            },
        });
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
        const isEqual = (0, compareFieldValues_1.compareFieldValues)(found, dataDto, {
            fields: compareFieldValues_1.checkExamFields,
        });
        const history = await this.employeeExamHistoryRepository.update(Object.assign(Object.assign({}, dataDto), (!isEqual && { sendEvent: true })));
        return history;
    }
};
UpdateEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository, EmployeeRepository_1.EmployeeRepository])
], UpdateEmployeeExamHistoryService);
exports.UpdateEmployeeExamHistoryService = UpdateEmployeeExamHistoryService;
//# sourceMappingURL=update.service.js.map