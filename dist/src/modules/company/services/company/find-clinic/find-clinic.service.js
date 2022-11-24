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
exports.FindClinicService = void 0;
const common_1 = require("@nestjs/common");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
let FindClinicService = class FindClinicService {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(clinicId, user) {
        const company = await this.companyRepository.findFirstNude({
            where: { id: clinicId },
            select: {
                id: true,
                address: true,
                email: true,
                phone: true,
                contacts: true,
                fantasy: true,
                name: true,
                initials: true,
                clinicExams: {
                    where: {
                        startDate: { lte: new Date() },
                        OR: [{ endDate: { gte: new Date() } }, { endDate: null }],
                        status: 'ACTIVE',
                    },
                    select: {
                        dueInDays: true,
                        scheduleType: true,
                        scheduleRange: true,
                        examId: true,
                        endDate: true,
                        id: true,
                        isPeriodic: true,
                        isChange: true,
                        isAdmission: true,
                        isReturn: true,
                        isDismissal: true,
                        observation: true,
                        isScheduled: true,
                    },
                },
            },
        });
        return company;
    }
};
FindClinicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository])
], FindClinicService);
exports.FindClinicService = FindClinicService;
//# sourceMappingURL=find-clinic.service.js.map