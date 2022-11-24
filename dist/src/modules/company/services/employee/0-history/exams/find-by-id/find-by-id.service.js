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
exports.FindByIdEmployeeExamHistoryService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../../../shared/constants/enum/errorMessage");
const EmployeeExamsHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
let FindByIdEmployeeExamHistoryService = class FindByIdEmployeeExamHistoryService {
    constructor(employeeExamHistoryRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
    }
    async execute(id, user) {
        const found = await this.employeeExamHistoryRepository.findFirstNude({
            where: { id, employee: { companyId: user.targetCompanyId } },
            include: {
                clinic: { select: { id: true, fantasy: true, address: true } },
                doctor: {
                    select: {
                        id: true,
                        councilId: true,
                        councilType: true,
                        councilUF: true,
                        professional: {
                            select: {
                                cpf: true,
                                name: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.FORBIDDEN_ACCESS);
        return found;
    }
};
FindByIdEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository])
], FindByIdEmployeeExamHistoryService);
exports.FindByIdEmployeeExamHistoryService = FindByIdEmployeeExamHistoryService;
//# sourceMappingURL=find-by-id.service.js.map