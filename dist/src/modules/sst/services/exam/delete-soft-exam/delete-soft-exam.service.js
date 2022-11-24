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
exports.DeleteSoftExamService = void 0;
const common_1 = require("@nestjs/common");
const ExamRepository_1 = require("../../../repositories/implementations/ExamRepository");
const isMater_1 = require("../../../../../shared/utils/isMater");
let DeleteSoftExamService = class DeleteSoftExamService {
    constructor(examRepository) {
        this.examRepository = examRepository;
    }
    async execute(id, userPayloadDto) {
        const user = (0, isMater_1.isMaster)(userPayloadDto);
        const companyId = user.companyId;
        let exam;
        if (user.isMaster) {
            exam = await this.examRepository.DeleteByIdSoft(id);
        }
        else {
            exam = await this.examRepository.DeleteByCompanyAndIdSoft(id, companyId);
        }
        if (!exam.id)
            throw new common_1.NotFoundException('data not found');
        return exam;
    }
};
DeleteSoftExamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExamRepository_1.ExamRepository])
], DeleteSoftExamService);
exports.DeleteSoftExamService = DeleteSoftExamService;
//# sourceMappingURL=delete-soft-exam.service.js.map