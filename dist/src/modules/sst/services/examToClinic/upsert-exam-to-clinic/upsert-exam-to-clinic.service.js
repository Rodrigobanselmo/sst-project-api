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
exports.UpsertExamToClinicService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const ExamToClinicRepository_1 = require("../../../repositories/implementations/ExamToClinicRepository");
let UpsertExamToClinicService = class UpsertExamToClinicService {
    constructor(examToClinicRepository, dayjs) {
        this.examToClinicRepository = examToClinicRepository;
        this.dayjs = dayjs;
    }
    async execute(createExamDto, user) {
        const [clinicExamActual, clinicExamOld] = await this.examToClinicRepository.findNude({
            where: {
                examId: createExamDto.examId,
                companyId: user.targetCompanyId,
                groupId: createExamDto.groupId || 'not-found',
            },
            orderBy: { startDate: 'desc' },
            take: 2,
        });
        if (!clinicExamActual) {
            const foundEqual = await this.examToClinicRepository.findNude({
                where: {
                    examId: createExamDto.examId,
                    companyId: user.targetCompanyId,
                    isAdmission: createExamDto.isAdmission,
                    isReturn: createExamDto.isReturn,
                    isChange: createExamDto.isChange,
                    isDismissal: createExamDto.isDismissal,
                    isPeriodic: createExamDto.isPeriodic,
                },
                take: 1,
            });
            if (foundEqual.length > 0)
                throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.CLINIC_EXAM_ALREADY_EXIST);
        }
        if (clinicExamActual && clinicExamActual.startDate >= this.dayjs.dateNow() && createExamDto.startDate >= this.dayjs.dateNow()) {
            const newExam = await this.examToClinicRepository.update(Object.assign(Object.assign({}, createExamDto), { companyId: user.targetCompanyId, id: clinicExamActual.id }));
            if (clinicExamOld)
                await this.examToClinicRepository.update({
                    examId: createExamDto.examId,
                    companyId: user.targetCompanyId,
                    id: clinicExamOld.id,
                    startDate: clinicExamOld.startDate,
                    endDate: createExamDto.startDate,
                });
            return newExam;
        }
        const newExam = await this.examToClinicRepository.upsert(Object.assign(Object.assign({}, createExamDto), { companyId: user.targetCompanyId, endDate: (clinicExamActual === null || clinicExamActual === void 0 ? void 0 : clinicExamActual.startDate) > createExamDto.startDate ? clinicExamActual === null || clinicExamActual === void 0 ? void 0 : clinicExamActual.startDate : undefined }));
        if ((clinicExamActual === null || clinicExamActual === void 0 ? void 0 : clinicExamActual.startDate) < (createExamDto === null || createExamDto === void 0 ? void 0 : createExamDto.startDate))
            await this.examToClinicRepository.update({
                examId: createExamDto.examId,
                companyId: user.targetCompanyId,
                id: clinicExamActual.id,
                startDate: clinicExamActual.startDate,
                endDate: createExamDto.startDate,
            });
        return newExam;
    }
};
UpsertExamToClinicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExamToClinicRepository_1.ExamToClinicRepository, DayJSProvider_1.DayJSProvider])
], UpsertExamToClinicService);
exports.UpsertExamToClinicService = UpsertExamToClinicService;
//# sourceMappingURL=upsert-exam-to-clinic.service.js.map