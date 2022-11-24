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
exports.CopyExamRiskService = void 0;
const common_1 = require("@nestjs/common");
const ExamRiskRepository_1 = require("../../../repositories/implementations/ExamRiskRepository");
let CopyExamRiskService = class CopyExamRiskService {
    constructor(examRiskRepository) {
        this.examRiskRepository = examRiskRepository;
    }
    async execute(copyExamsRiskDto, user) {
        const FromExamFactor = await this.examRiskRepository.findNude({
            where: { companyId: copyExamsRiskDto.fromCompanyId, endDate: null },
        });
        const ActualExamFactor = await this.examRiskRepository.findNude({
            where: { companyId: user.targetCompanyId, endDate: null },
            select: { riskId: true, examId: true },
        });
        const copyData = FromExamFactor.map((exam) => {
            const found = ActualExamFactor.find((aExam) => aExam.examId === exam.examId && aExam.riskId === exam.riskId);
            if (found)
                return null;
            return exam;
        }).filter((i) => i);
        const ExamFactor = await this.examRiskRepository.createMany({
            data: copyData,
            companyId: user.targetCompanyId,
        });
        return ExamFactor;
    }
};
CopyExamRiskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExamRiskRepository_1.ExamRiskRepository])
], CopyExamRiskService);
exports.CopyExamRiskService = CopyExamRiskService;
//# sourceMappingURL=copy-exam.service.js.map