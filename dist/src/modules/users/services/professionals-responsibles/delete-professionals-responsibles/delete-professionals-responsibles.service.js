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
exports.DeleteProfessionalResponsibleService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../../company/repositories/implementations/EmployeePPPHistoryRepository");
const ProfessionalResponsibleRepository_1 = require("./../../../repositories/implementations/ProfessionalResponsibleRepository");
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let DeleteProfessionalResponsibleService = class DeleteProfessionalResponsibleService {
    constructor(professionalResponsibleRepository, employeePPPHistoryRepository) {
        this.professionalResponsibleRepository = professionalResponsibleRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(id, user) {
        const professionalResponsibleFound = await this.professionalResponsibleRepository.findFirstNude({
            where: {
                id,
                companyId: user.targetCompanyId,
            },
        });
        if (!(professionalResponsibleFound === null || professionalResponsibleFound === void 0 ? void 0 : professionalResponsibleFound.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.PROFESSIONAL_NOT_FOUND);
        const professionalResponsible = await this.professionalResponsibleRepository.delete(id);
        this.employeePPPHistoryRepository.updateManyNude({
            data: { sendEvent: true },
            where: {
                employee: {
                    companyId: user.targetCompanyId,
                },
            },
        });
        return professionalResponsible;
    }
};
DeleteProfessionalResponsibleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProfessionalResponsibleRepository_1.ProfessionalResponsibleRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], DeleteProfessionalResponsibleService);
exports.DeleteProfessionalResponsibleService = DeleteProfessionalResponsibleService;
//# sourceMappingURL=delete-professionals-responsibles.service.js.map