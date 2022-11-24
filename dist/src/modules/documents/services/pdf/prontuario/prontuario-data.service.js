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
exports.PdfProntuarioDataService = void 0;
const find_by_employee_service_1 = require("./../../../../sst/services/risk-data/find-by-employee/find-by-employee.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const EmployeeRepository_1 = require("../../../../company/repositories/implementations/EmployeeRepository");
const onGetRisks_1 = require("../../../../../shared/utils/onGetRisks");
const upload_pgr_doc_service_1 = require("../../pgr/document/upload-pgr-doc.service");
let PdfProntuarioDataService = class PdfProntuarioDataService {
    constructor(employeeRepository, findAllRiskDataByEmployeeService) {
        this.employeeRepository = employeeRepository;
        this.findAllRiskDataByEmployeeService = findAllRiskDataByEmployeeService;
    }
    async execute(employeeId, userPayloadDto) {
        var _a, _b, _c, _d, _e, _f, _g;
        const companyId = userPayloadDto.targetCompanyId;
        const employeeData = await this.employeeRepository.findFirstNude({
            where: {
                id: employeeId,
                OR: [{ examsHistory: { some: { clinicId: companyId } } }, { companyId: companyId }],
            },
            select: {
                name: true,
                sex: true,
                company: {
                    select: {
                        name: true,
                        initials: true,
                        logoUrl: true,
                        cnpj: true,
                        doctorResponsible: { select: { councilId: true, councilType: true, councilUF: true, professional: { select: { name: true } } } },
                        group: {
                            select: {
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
                    where: { status: { in: ['PROCESSING', 'DONE'] }, exam: { isAttendance: true } },
                    select: { doneDate: true, changeHierarchyDate: true, examId: true },
                    orderBy: { doneDate: 'desc' },
                    take: 1,
                },
                hierarchyHistory: {
                    where: { motive: 'ADM' },
                    select: { startDate: true },
                    orderBy: { startDate: 'desc' },
                    take: 1,
                },
            },
        });
        const admissionDate = ((_b = (_a = employeeData === null || employeeData === void 0 ? void 0 : employeeData.hierarchyHistory) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.startDate) || ((_c = employeeData === null || employeeData === void 0 ? void 0 : employeeData.examsHistory[0]) === null || _c === void 0 ? void 0 : _c.changeHierarchyDate) || ((_d = employeeData === null || employeeData === void 0 ? void 0 : employeeData.examsHistory[0]) === null || _d === void 0 ? void 0 : _d.doneDate);
        const { risk: riskData, employee: employeeRisk } = await this.findAllRiskDataByEmployeeService.getRiskData(employeeId, undefined, {
            fromExam: true,
            hierarchyData: true,
            filterDate: true,
        });
        const questions = await this.getQuestions(employeeData, companyId);
        const examination = await this.getExamination(employeeData, companyId);
        const asoRiskData = (0, upload_pgr_doc_service_1.checkRiskDataDoc)(riskData, { docType: 'isAso', companyId: companyId });
        const asoRisk = (0, onGetRisks_1.onGetRisks)(asoRiskData);
        const employee = Object.assign(Object.assign({}, employeeRisk), employeeData);
        const consultantCompany = (_g = (_f = (_e = employee === null || employee === void 0 ? void 0 : employee.company) === null || _e === void 0 ? void 0 : _e.receivingServiceContracts) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.applyingServiceCompany;
        const actualCompany = employee.company;
        const sector = this.onGetSector(employee === null || employee === void 0 ? void 0 : employee.hierarchy);
        const clinicExam = employee.examsHistory[0];
        const doctorResponsible = actualCompany.doctorResponsible;
        return {
            questions,
            examination,
            employee,
            doctorResponsible,
            sector,
            clinicExam,
            actualCompany,
            consultantCompany,
            admissionDate,
            risks: asoRisk.map((risk) => ({ riskData: risk.riskData[0], riskFactor: risk.riskFactor })),
        };
    }
    async getQuestions(employee, companyId) {
        const questions = [
            { name: 'Estado de saúde atual?', textAnswer: '' },
            { name: 'Fuma?', textAnswer: 'Frequência:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Álcool?', textAnswer: 'Frequência:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Pratica esporte ou lazer?', textAnswer: 'Frequência:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Diabetes?', textAnswer: 'Medicação:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Pressão alta?', textAnswer: 'Medicação:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Varizes', textAnswer: 'Tratamento:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Hérnia', textAnswer: 'Tratamento:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Alergia', textAnswer: 'A que ?', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Faz uso regular de medicação?', textAnswer: 'Qual ?', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Faz acompanhamento médico?', textAnswer: 'Especialização:', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Fez alguma cirurgia?', textAnswer: 'Por quê?Quando?', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Ficou internado?', textAnswer: 'Por quê?Quando?', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Escuta bem', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Enxerga bem', textAnswer: 'Usa lentes corretivas?', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Data da última menstruação?', textAnswer: 'Data:', sex: client_1.SexTypeEnum.F },
            { name: 'Gestações e partos?', textAnswer: '', sex: client_1.SexTypeEnum.F },
        ].filter((q) => !q.sex || q.sex == employee.sex);
        return questions;
    }
    async getExamination(employee, companyId) {
        const examination = [
            { name: 'Aparelho Cardíaco normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Aparelho pulmonar normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Coluna normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Abdomen normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'Afecções dermatológicas?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'MMSS normais?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
            { name: 'MMII normais?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
        ].filter((q) => !q.sex || q.sex == employee.sex);
        return examination;
    }
    onGetSector(hierarchy) {
        var _a;
        return (_a = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.parents) === null || _a === void 0 ? void 0 : _a.find((parent) => parent.type == 'SECTOR');
    }
};
PdfProntuarioDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository, find_by_employee_service_1.FindAllRiskDataByEmployeeService])
], PdfProntuarioDataService);
exports.PdfProntuarioDataService = PdfProntuarioDataService;
//# sourceMappingURL=prontuario-data.service.js.map