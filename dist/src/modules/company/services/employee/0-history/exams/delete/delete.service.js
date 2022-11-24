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
exports.DeleteEmployeeExamHistoryService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../../../shared/constants/enum/errorMessage");
const AmazonStorageProvider_1 = require("./../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const EmployeeExamsHistoryRepository_1 = require("./../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
let DeleteEmployeeExamHistoryService = class DeleteEmployeeExamHistoryService {
    constructor(amazonStorageProvider, employeeExamHistoryRepository) {
        this.amazonStorageProvider = amazonStorageProvider;
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
    }
    async execute(id, employeeId, user) {
        const companyId = user.targetCompanyId;
        return;
        const found = await this.employeeExamHistoryRepository.findFirstNude({
            where: {
                id,
                employeeId,
                employee: { companyId },
            },
            select: {
                id: true,
                fileUrl: true,
            },
        });
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
        if (found === null || found === void 0 ? void 0 : found.fileUrl) {
            const foundByFileUrl = await this.employeeExamHistoryRepository.findNude({
                where: {
                    fileUrl: found.fileUrl,
                },
                select: {
                    id: true,
                    fileUrl: true,
                },
            });
            if (foundByFileUrl.length > 1) {
                const splitUrl = found.fileUrl.split('.com/');
                await this.amazonStorageProvider.delete({
                    fileName: splitUrl[splitUrl.length - 1],
                });
            }
        }
        const history = await this.employeeExamHistoryRepository.delete(id);
        return history;
    }
};
DeleteEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [AmazonStorageProvider_1.AmazonStorageProvider, EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository])
], DeleteEmployeeExamHistoryService);
exports.DeleteEmployeeExamHistoryService = DeleteEmployeeExamHistoryService;
//# sourceMappingURL=delete.service.js.map