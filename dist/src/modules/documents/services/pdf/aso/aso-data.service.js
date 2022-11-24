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
exports.PdfAsoDataService = exports.checkExamType = void 0;
const HierarchyRepository_1 = require("./../../../../company/repositories/implementations/HierarchyRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const onGetRisks_1 = require("../../../../../shared/utils/onGetRisks");
const EmployeeExamsHistoryRepository_1 = require("../../../../company/repositories/implementations/EmployeeExamsHistoryRepository");
const find_exam_by_hierarchy_service_1 = require("../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service");
const find_by_employee_service_1 = require("../../../../sst/services/risk-data/find-by-employee/find-by-employee.service");
const upload_pgr_doc_service_1 = require("../../pgr/document/upload-pgr-doc.service");
const checkExamType = (exam, examType) => {
    const isAdmission = examType == client_1.ExamHistoryTypeEnum.ADMI;
    const isChange = examType == client_1.ExamHistoryTypeEnum.CHAN;
    const isDismissal = examType == client_1.ExamHistoryTypeEnum.DEMI;
    const isPeriodic = examType == client_1.ExamHistoryTypeEnum.PERI;
    const isReturn = examType == client_1.ExamHistoryTypeEnum.RETU;
    const isOfficeChange = examType == client_1.ExamHistoryTypeEnum.OFFI;
    if (isAdmission && !exam.isAdmission)
        return false;
    if (isChange && !exam.isChange)
        return false;
    if (isDismissal && !exam.isDismissal)
        return false;
    if (isPeriodic && !exam.isPeriodic)
        return false;
    if (isReturn && !exam.isReturn)
        return false;
    if (isOfficeChange && !exam.isPeriodic && !exam.isAdmission && !exam.isChange)
        return false;
    return true;
};
exports.checkExamType = checkExamType;
let PdfAsoDataService = class PdfAsoDataService {
    constructor(employeeExamsHistoryRepository, hierarchyRepository, findAllRiskDataByEmployeeService, findExamByHierarchyService) {
        this.employeeExamsHistoryRepository = employeeExamsHistoryRepository;
        this.hierarchyRepository = hierarchyRepository;
        this.findAllRiskDataByEmployeeService = findAllRiskDataByEmployeeService;
        this.findExamByHierarchyService = findExamByHierarchyService;
    }
    async execute(employeeId, userPayloadDto, asoId) {
        var _a, _b, _c, _d, _e, _f, _g;
        const companyId = userPayloadDto.targetCompanyId;
        const clinicExam = await this.employeeExamsHistoryRepository.findFirstNude({
            where: Object.assign(Object.assign({}, (asoId && { id: asoId })), { employeeId, exam: { isAttendance: true }, OR: [{ clinicId: companyId }, { employee: { companyId } }] }),
            orderBy: { doneDate: 'desc' },
            select: {
                id: true,
                clinic: { select: { id: true, fantasy: true } },
                examType: true,
                employee: {
                    select: {
                        name: true,
                        cpf: true,
                        birthday: true,
                        companyId: true,
                        sex: true,
                        company: {
                            select: {
                                name: true,
                                initials: true,
                                logoUrl: true,
                                cnpj: true,
                                address: true,
                                doctorResponsible: { select: { councilId: true, councilType: true, councilUF: true, professional: { select: { name: true } } } },
                                numAsos: true,
                                group: {
                                    select: {
                                        numAsos: true,
                                        doctorResponsible: { select: { councilId: true, councilType: true, councilUF: true, professional: { select: { name: true } } } },
                                    },
                                },
                                contacts: { select: { phone: true, id: true, isPrincipal: true, email: true }, take: 1, orderBy: { isPrincipal: 'desc' } },
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
                            distinct: ['examId'],
                            where: { status: { in: ['PROCESSING', 'DONE'] }, exam: { isAttendance: false } },
                            select: { exam: { select: { name: true } }, doneDate: true, changeHierarchyDate: true, examId: true },
                            orderBy: { doneDate: 'desc' },
                        },
                        hierarchyHistory: {
                            where: { motive: 'ADM' },
                            select: { startDate: true },
                            orderBy: { startDate: 'desc' },
                            take: 1,
                        },
                    },
                },
            },
        });
        if (!(clinicExam === null || clinicExam === void 0 ? void 0 : clinicExam.id))
            throw new common_1.ForbiddenException(errorMessage_1.ErrorMessageEnum.FORBIDDEN_ACCESS);
        const examType = clinicExam.examType;
        const admissionDate = ((_c = (_b = (_a = clinicExam === null || clinicExam === void 0 ? void 0 : clinicExam.employee) === null || _a === void 0 ? void 0 : _a.hierarchyHistory) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.startDate) || (clinicExam === null || clinicExam === void 0 ? void 0 : clinicExam.changeHierarchyDate);
        const { risk: riskData, employee: employeeRisk } = await this.findAllRiskDataByEmployeeService.getRiskData(employeeId, undefined, {
            fromExam: true,
            hierarchyData: true,
            filterDate: true,
        });
        const asoRiskData = (0, upload_pgr_doc_service_1.checkRiskDataDoc)(riskData, { docType: 'isAso', companyId: clinicExam.employee.companyId });
        const asoRisk = (0, onGetRisks_1.onGetRisks)(asoRiskData);
        const employee = Object.assign(Object.assign({}, employeeRisk), clinicExam.employee);
        const examsHistory = employee.examsHistory;
        const consultantCompany = (_g = (_f = (_e = (_d = clinicExam.employee) === null || _d === void 0 ? void 0 : _d.company) === null || _e === void 0 ? void 0 : _e.receivingServiceContracts) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.applyingServiceCompany;
        const actualCompany = clinicExam === null || clinicExam === void 0 ? void 0 : clinicExam.employee.company;
        const sector = this.onGetSector(employee === null || employee === void 0 ? void 0 : employee.hierarchy);
        actualCompany === null || actualCompany === void 0 ? true : delete actualCompany.receivingServiceContracts;
        employee === null || employee === void 0 ? true : delete employee.company;
        delete clinicExam.employee;
        const doctorResponsible = actualCompany.doctorResponsible;
        const numAsos = actualCompany.numAsos;
        const examsRepresentAll = await this.findExamByHierarchyService.onGetAllExams(employee.companyId);
        const exams = this.onGetAllExamsData(employee, asoRisk, examsRepresentAll === null || examsRepresentAll === void 0 ? void 0 : examsRepresentAll.data, examType);
        const doneExams = exams.map((examData) => {
            const history = examsHistory.find((examHistory) => examHistory.examId == examData.examId);
            return { exam: examData.exam, doneDate: history === null || history === void 0 ? void 0 : history.doneDate };
        });
        const protocols = asoRisk
            .map((r) => r.riskData.map((rd) => rd.protocolsToRisk))
            .reduce((acc, curr) => {
            if (!curr)
                return acc;
            return [...acc, ...curr];
        }, [])
            .reduce((acc, curr) => {
            if (!curr)
                return acc;
            return [...acc, ...curr];
        }, []);
        return {
            doneExams,
            consultantCompany,
            actualCompany,
            doctorResponsible,
            numAsos,
            clinicExam,
            employee,
            risks: asoRisk.map((risk) => ({ riskData: risk.riskData[0], riskFactor: risk.riskFactor })),
            sector,
            protocols,
            admissionDate,
        };
    }
    onGetAllExamsData(employee, asoRisk, examRepresentAll, examType) {
        const exams = [];
        asoRisk === null || asoRisk === void 0 ? void 0 : asoRisk.forEach((data) => {
            var _a, _b;
            (_a = data === null || data === void 0 ? void 0 : data.riskData) === null || _a === void 0 ? void 0 : _a.forEach((rd) => {
                rd.examsToRiskFactorData.forEach((e) => {
                    exams.push(e);
                });
            });
            (_b = data === null || data === void 0 ? void 0 : data.riskFactor) === null || _b === void 0 ? void 0 : _b.examToRisk.forEach((e) => {
                exams.push(e);
            });
        });
        examRepresentAll === null || examRepresentAll === void 0 ? void 0 : examRepresentAll.forEach((exam) => {
            exam === null || exam === void 0 ? void 0 : exam.examToRisk.forEach((e) => {
                delete exam.examToRisk;
                exams.push(Object.assign(Object.assign({}, e), { exam: exam }));
            });
        });
        return exams.filter((item, index, self) => (0, exports.checkExamType)(item, examType) && !this.findExamByHierarchyService.checkIfSkipEmployee(item, employee) && index === self.findIndex((t) => t.examId == item.examId));
    }
    onGetSector(hierarchy) {
        var _a;
        return (_a = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.parents) === null || _a === void 0 ? void 0 : _a.find((parent) => parent.type == 'SECTOR');
    }
};
PdfAsoDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository,
        HierarchyRepository_1.HierarchyRepository,
        find_by_employee_service_1.FindAllRiskDataByEmployeeService,
        find_exam_by_hierarchy_service_1.FindExamByHierarchyService])
], PdfAsoDataService);
exports.PdfAsoDataService = PdfAsoDataService;
//# sourceMappingURL=aso-data.service.js.map