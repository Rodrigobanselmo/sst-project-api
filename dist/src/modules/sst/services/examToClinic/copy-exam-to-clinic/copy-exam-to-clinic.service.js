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
exports.CopyExamToClinicService = void 0;
const ExamToClinicRepository_1 = require("../../../repositories/implementations/ExamToClinicRepository");
const common_1 = require("@nestjs/common");
let CopyExamToClinicService = class CopyExamToClinicService {
    constructor(examRepository) {
        this.examRepository = examRepository;
    }
    async execute(copyExamsDto, user) {
        const FromExamFactor = await this.examRepository.findNude({
            where: { companyId: copyExamsDto.fromCompanyId, endDate: null },
        });
        const ActualExamFactor = await this.examRepository.findNude({
            where: { companyId: user.targetCompanyId, endDate: null },
        });
        const copyData = FromExamFactor.map((exam) => {
            const found = ActualExamFactor.find((aExam) => aExam.examId === exam.examId);
            if (found)
                return null;
            return exam;
        }).filter((i) => i);
        const ExamFactor = await this.examRepository.createMany({
            data: copyData,
            companyId: user.targetCompanyId,
        });
        return ExamFactor;
    }
};
CopyExamToClinicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExamToClinicRepository_1.ExamToClinicRepository])
], CopyExamToClinicService);
exports.CopyExamToClinicService = CopyExamToClinicService;
//# sourceMappingURL=copy-exam-to-clinic.service.js.map