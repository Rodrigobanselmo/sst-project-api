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
exports.PdfGuideDataService = void 0;
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const HierarchyRepository_1 = require("./../../../../company/repositories/implementations/HierarchyRepository");
const common_1 = require("@nestjs/common");
const removeDuplicate_1 = require("../../../../../shared/utils/removeDuplicate");
const CompanyRepository_1 = require("../../../../company/repositories/implementations/CompanyRepository");
const EmployeeRepository_1 = require("../../../../company/repositories/implementations/EmployeeRepository");
const data_sort_1 = require("../../../../../shared/utils/sorts/data.sort");
const uuid_1 = require("uuid");
let PdfGuideDataService = class PdfGuideDataService {
    constructor(employeeRepository, companyRepository, hierarchyRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(employeeId, userPayloadDto) {
        var _a, _b, _c;
        const companyId = userPayloadDto.targetCompanyId;
        const data = await this.employeeRepository.findFirstNude({
            where: { id: employeeId, OR: [{ examsHistory: { some: { clinicId: companyId } } }, { companyId: companyId }] },
            select: {
                cpf: true,
                name: true,
                email: true,
                companyId: true,
                hierarchy: { select: { name: true } },
                company: {
                    select: {
                        id: true,
                        initials: true,
                        name: true,
                        cnpj: true,
                        fantasy: true,
                        logoUrl: true,
                        receivingServiceContracts: {
                            select: {
                                applyingServiceCompany: {
                                    select: {
                                        initials: true,
                                        id: true,
                                        name: true,
                                        cnpj: true,
                                        logoUrl: true,
                                        fantasy: true,
                                        contacts: { select: { phone: true, id: true, isPrincipal: true, email: true }, take: 1, orderBy: { isPrincipal: 'desc' } },
                                    },
                                },
                            },
                            where: {
                                applyingServiceCompany: {
                                    isConsulting: true,
                                    isGroup: false,
                                    license: { status: 'ACTIVE' },
                                },
                            },
                        },
                    },
                },
                examsHistory: {
                    where: { status: 'PROCESSING' },
                    select: {
                        clinicId: true,
                        examId: true,
                        doneDate: true,
                        time: true,
                        hierarchyId: true,
                        examType: true,
                        exam: {
                            select: {
                                id: true,
                                name: true,
                                instruction: true,
                                isAttendance: true,
                            },
                        },
                    },
                },
            },
        });
        if (!data)
            throw new common_1.ForbiddenException(errorMessage_1.ErrorMessageEnum.FORBIDDEN_ACCESS);
        const clinicIds = data.examsHistory.map((data) => data.clinicId);
        const examIds = data.examsHistory.map((data) => data.examId);
        const clinics = await this.companyRepository.findNude({
            select: {
                address: true,
                id: true,
                obs: true,
                name: true,
                fantasy: true,
                contacts: {
                    where: { isPrincipal: true },
                    select: { email: true, phone: true, phone_1: true },
                },
                clinicExams: {
                    select: { isScheduled: true, examId: true, scheduleRange: true },
                    where: { examId: { in: examIds } },
                },
            },
            where: { id: { in: clinicIds } },
        });
        const consultantCompany = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.company) === null || _a === void 0 ? void 0 : _a.receivingServiceContracts) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.applyingServiceCompany;
        const actualCompany = data === null || data === void 0 ? void 0 : data.company;
        actualCompany === null || actualCompany === void 0 ? true : delete actualCompany.receivingServiceContracts;
        const examInstructions = (0, removeDuplicate_1.removeDuplicate)(data === null || data === void 0 ? void 0 : data.examsHistory.map((examHistory) => examHistory.exam), { removeById: 'id' });
        const clinicExamBlock = {};
        const clinicComplementaryExamBlocks = {};
        let hierarchyId = '';
        data === null || data === void 0 ? void 0 : data.examsHistory.forEach((examHistory) => {
            const key = `${examHistory.clinicId}${examHistory.doneDate}${examHistory.time}`;
            if (examHistory.hierarchyId)
                hierarchyId = examHistory.hierarchyId;
            if (examHistory.exam.isAttendance) {
                const clinic = clinics.find((c) => c.id === examHistory.clinicId);
                const exam = clinic.clinicExams.find((c) => c.examId === examHistory.exam.id);
                clinicExamBlock.clinic = clinic;
                clinicExamBlock.doneDate = examHistory.doneDate;
                clinicExamBlock.exam = examHistory.exam;
                clinicExamBlock.time = examHistory.time;
                clinicExamBlock.type = examHistory.examType;
                clinicExamBlock.id = key;
                if (exam) {
                    clinicExamBlock.isScheduled = exam === null || exam === void 0 ? void 0 : exam.isScheduled;
                    clinicExamBlock.scheduleRange = exam === null || exam === void 0 ? void 0 : exam.scheduleRange;
                }
                return;
            }
            const clinic = clinics.find((c) => c.id === examHistory.clinicId);
            const exam = clinic.clinicExams.find((c) => c.examId === examHistory.exam.id);
            if (!clinicComplementaryExamBlocks[key])
                clinicComplementaryExamBlocks[key] = {
                    clinic,
                    doneDate: examHistory.doneDate,
                    exams: [],
                    time: examHistory.time,
                    isScheduled: exam.isScheduled,
                    scheduleRange: exam.scheduleRange,
                };
            clinicComplementaryExamBlocks[key].exams.push(examHistory.exam);
        });
        delete data.examsHistory;
        if (hierarchyId) {
            const hierarchy = await this.hierarchyRepository.findById(hierarchyId, data.companyId);
            data.hierarchy = hierarchy;
        }
        return Object.assign(Object.assign({}, data), { clinics, exams: examInstructions, consultantCompany: (consultantCompany === null || consultantCompany === void 0 ? void 0 : consultantCompany.id) ? consultantCompany : actualCompany, company: actualCompany, clinicComplementaryExams: Object.values(clinicComplementaryExamBlocks).sort((a, b) => (0, data_sort_1.sortData)(a.doneDate, b.doneDate)), clinicExam: clinicExamBlock, user: { email: userPayloadDto.email, id: (0, uuid_1.v4)() } });
    }
};
PdfGuideDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository,
        CompanyRepository_1.CompanyRepository,
        HierarchyRepository_1.HierarchyRepository])
], PdfGuideDataService);
exports.PdfGuideDataService = PdfGuideDataService;
//# sourceMappingURL=guide-data.service.js.map