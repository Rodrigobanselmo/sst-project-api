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
exports.CreateProfessionalResponsibleService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../../company/repositories/implementations/EmployeePPPHistoryRepository");
const ProfessionalResponsibleRepository_1 = require("../../../repositories/implementations/ProfessionalResponsibleRepository");
const common_1 = require("@nestjs/common");
let CreateProfessionalResponsibleService = class CreateProfessionalResponsibleService {
    constructor(professionalResponsibleRepository, employeePPPHistoryRepository) {
        this.professionalResponsibleRepository = professionalResponsibleRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(UpsertProfessionalResponsibleDto, user) {
        const professionalResponsible = await this.professionalResponsibleRepository.create(Object.assign(Object.assign({}, UpsertProfessionalResponsibleDto), { companyId: user.targetCompanyId }));
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
CreateProfessionalResponsibleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProfessionalResponsibleRepository_1.ProfessionalResponsibleRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], CreateProfessionalResponsibleService);
exports.CreateProfessionalResponsibleService = CreateProfessionalResponsibleService;
//# sourceMappingURL=create-professional-responsiblea.service.js.map