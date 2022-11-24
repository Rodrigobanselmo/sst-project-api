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
exports.FindExamByHierarchyService = exports.getValidityInMonths = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const origin_risk_1 = require("../../../../../shared/constants/maps/origin-risk");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const number_sort_1 = require("../../../../../shared/utils/sorts/number.sort");
const string_sort_1 = require("../../../../../shared/utils/sorts/string.sort");
const EmployeeRepository_1 = require("../../../../company/repositories/implementations/EmployeeRepository");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const upload_pgr_doc_service_1 = require("../../../../documents/services/pgr/document/upload-pgr-doc.service");
const ExamRepository_1 = require("../../../repositories/implementations/ExamRepository");
const RiskDataRepository_1 = require("../../../repositories/implementations/RiskDataRepository");
const getValidityInMonths = (employee, examRisk) => {
    return employee.isComorbidity ? examRisk.lowValidityInMonths || examRisk.validityInMonths : examRisk.validityInMonths;
};
exports.getValidityInMonths = getValidityInMonths;
let FindExamByHierarchyService = class FindExamByHierarchyService {
    constructor(employeeRepository, examRepository, riskDataRepository, hierarchyRepository, dayjs) {
        this.employeeRepository = employeeRepository;
        this.examRepository = examRepository;
        this.riskDataRepository = riskDataRepository;
        this.hierarchyRepository = hierarchyRepository;
        this.dayjs = dayjs;
        this.clinicExamCloseToExpire = 45;
    }
    async execute(user, query) {
        var _a;
        const hierarchyId = query.hierarchyId;
        const companyId = user.targetCompanyId;
        const hierarchy = hierarchyId ? await this.hierarchyRepository.findByIdWithParent(hierarchyId, companyId) : undefined;
        const hierarchies = [hierarchy, ...((hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.parents) || [])].filter((h) => h);
        const date = new Date();
        const examType = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ('isPeriodic' in query && {
            isPeriodic: query === null || query === void 0 ? void 0 : query.isPeriodic,
        })), ('isChange' in query && { isChange: query === null || query === void 0 ? void 0 : query.isChange })), ('isAdmission' in query && {
            isAdmission: query === null || query === void 0 ? void 0 : query.isAdmission,
        })), ('isReturn' in query && { isReturn: query === null || query === void 0 ? void 0 : query.isReturn })), ('isDismissal' in query && {
            isDismissal: query === null || query === void 0 ? void 0 : query.isDismissal,
        }));
        if (query.employeeId) {
            this.employee = await this.employeeRepository.findById(query.employeeId, companyId, {
                include: {
                    subOffices: { select: { id: true } },
                    examsHistory: {
                        where: {
                            AND: [
                                { expiredDate: { gte: new Date() } },
                                {
                                    status: query.isPendingExams ? { in: ['PENDING', 'PROCESSING'] } : 'DONE',
                                },
                            ],
                        },
                    },
                },
            });
            if (this.employee && !query.isOffice) {
                hierarchies.push(...(((_a = this.employee) === null || _a === void 0 ? void 0 : _a.subOffices) || []));
            }
        }
        const hierarchyIds = hierarchies.map(({ id }) => id);
        const riskData = (await this.riskDataRepository.findNude({
            select: {
                examsToRiskFactorData: {
                    include: {
                        exam: { select: { name: true, id: true, isAttendance: true } },
                    },
                    where: Object.assign({}, examType),
                },
                riskFactor: {
                    select: {
                        name: true,
                        severity: true,
                        type: true,
                        representAll: true,
                        id: true,
                        isAso: true,
                        isPCMSO: true,
                        docInfo: {
                            where: {
                                OR: [
                                    { companyId },
                                    {
                                        company: {
                                            applyingServiceContracts: {
                                                some: { receivingServiceCompanyId: companyId },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        examToRisk: {
                            include: {
                                exam: {
                                    select: { name: true, id: true, isAttendance: true },
                                },
                            },
                            where: Object.assign({ companyId, exam: { isAttendance: false } }, examType),
                        },
                    },
                },
                homogeneousGroup: {
                    include: {
                        hierarchyOnHomogeneous: Object.assign({ select: {
                                hierarchy: { select: { id: true, type: true, name: true } },
                            } }, (hierarchyId && {
                            where: Object.assign({ homogeneousGroup: { type: 'HIERARCHY' } }, (date && { AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }] })),
                        })),
                        characterization: { select: { name: true, type: true } },
                        environment: { select: { name: true, type: true } },
                    },
                },
                id: true,
                probability: true,
                probabilityAfter: true,
                companyId: true,
                hierarchyId: true,
                homogeneousGroupId: true,
                riskId: true,
                dataRecs: true,
                level: true,
                json: true,
                standardExams: true,
                riskFactorGroupDataId: true,
            },
            where: Object.assign(Object.assign(Object.assign(Object.assign({}, (date && { AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }] })), { companyId }), (hierarchyIds.length > 0 && {
                homogeneousGroup: {
                    hierarchyOnHomogeneous: {
                        some: Object.assign(Object.assign({}, (date && { AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }] })), { hierarchyId: { in: hierarchyIds } }),
                    },
                },
            })), { OR: [
                    {
                        examsToRiskFactorData: {
                            some: Object.assign({ examId: { gt: 0 } }, (query.onlyAttendance && { exam: { isAttendance: true } })),
                        },
                    },
                    ...(hierarchyIds.length > 0
                        ? [
                            {
                                riskFactor: {
                                    examToRisk: {
                                        some: Object.assign({ examId: { gt: 0 } }, (query.onlyAttendance && {
                                            exam: { isAttendance: true },
                                        })),
                                    },
                                },
                                standardExams: true,
                            },
                        ]
                        : []),
                ] }),
        })).filter((riskData) => {
            var _a;
            return (_a = (0, upload_pgr_doc_service_1.getRiskDoc)(riskData.riskFactor, { companyId, hierarchyId })) === null || _a === void 0 ? void 0 : _a.isAso;
        });
        const riskDataOrigin = riskData.map((rd) => {
            var _a;
            let prioritization;
            if (rd.homogeneousGroup.type === client_1.HomoTypeEnum.HIERARCHY && rd.homogeneousGroup.hierarchy) {
                prioritization = (_a = origin_risk_1.originRiskMap[rd.homogeneousGroup.hierarchy.type]) === null || _a === void 0 ? void 0 : _a.prioritization;
            }
            rd.examsToRiskFactorData = rd.examsToRiskFactorData.filter((item, index, self) => index ===
                self.findIndex((t) => t.examId == item.examId &&
                    t.isMale == item.isMale &&
                    t.isAdmission == item.isAdmission &&
                    t.isDismissal == item.isDismissal &&
                    t.isPeriodic == item.isPeriodic &&
                    t.isReturn == item.isReturn &&
                    t.isMale == item.isMale &&
                    t.isFemale == item.isFemale &&
                    t.fromAge == item.fromAge &&
                    t.toAge == item.toAge &&
                    t.validityInMonths == item.validityInMonths &&
                    t.riskFactorDataId == item.riskFactorDataId));
            return Object.assign(Object.assign({}, rd), { prioritization });
        });
        const exams = {};
        riskDataOrigin.forEach((rd) => {
            rd.examsToRiskFactorData.forEach((examData) => {
                if (!exams[examData.examId])
                    exams[examData.examId] = [];
                exams[examData.examId].push(Object.assign(Object.assign(Object.assign({}, examData), { origin: examData.isStandard ? `Padrão (${rd.origin && rd.origin})` : rd.origin, prioritization: (examData.isStandard ? 100 : rd.prioritization) || 3, homogeneousGroup: rd.homogeneousGroup, skipEmployee: this.checkIfSkipEmployee(examData, this.employee), risk: rd.riskFactor }), this.checkExpiredDate(examData, this.employee)));
            });
        });
        const examRepresentAll = hierarchyIds.length > 0 ? await this.onGetAllExams(companyId, { examsTypes: examType, onlyAttendance: query.onlyAttendance }) : { data: [] };
        examRepresentAll.data.map((exam) => {
            exam.examToRisk.map((examToRisk) => {
                if (!exams[examToRisk.examId])
                    exams[examToRisk.examId] = [];
                exams[examToRisk.examId].push(Object.assign(Object.assign(Object.assign({}, examToRisk), { origin: 'Padrão', isStandard: true, exam: {
                        name: exam.name,
                        id: exam.id,
                        isAttendance: !!(exam === null || exam === void 0 ? void 0 : exam.isAttendance),
                    }, prioritization: 100, skipEmployee: this.checkIfSkipEmployee(examToRisk, this.employee), risk: examToRisk.risk }), this.checkExpiredDate(Object.assign(Object.assign({}, examToRisk), { exam }), this.employee)));
            });
        });
        const lastClinicExam = {
            expiredDate: new Date(),
            closeToExpired: true,
        };
        const examsDataReturn = Object.entries(exams)
            .map(([examId, examData]) => {
            var _a, _b, _c, _d;
            const origins = examData.sort((a, b) => (0, number_sort_1.sortNumber)(a, b, 'validityInMonths')).sort((a, b) => (0, number_sort_1.sortNumber)(a, b, 'prioritization'));
            const isAttendance = (_b = (_a = examData[0]) === null || _a === void 0 ? void 0 : _a.exam) === null || _b === void 0 ? void 0 : _b.isAttendance;
            if (isAttendance) {
                const origin = origins.find((a) => !a.skipEmployee);
                if (origin) {
                    lastClinicExam.expiredDate = origin.expiredDate;
                    lastClinicExam.closeToExpired = origin.closeToExpired;
                }
            }
            return {
                exam: {
                    id: examId,
                    name: (_d = (_c = examData[0]) === null || _c === void 0 ? void 0 : _c.exam) === null || _d === void 0 ? void 0 : _d.name,
                    isAttendance,
                },
                origins,
            };
        })
            .sort((a, b) => (0, string_sort_1.sortString)(a.exam, b.exam, 'name'))
            .sort((a, b) => (0, number_sort_1.sortNumber)(b.exam.isAttendance ? 1 : 0, a.exam.isAttendance ? 1 : 0)).map((data) => {
            data.origins = data.origins.map((origin) => {
                if (origin.status == client_1.StatusEnum.ACTIVE) {
                    origin.status = client_1.StatusEnum.DONE;
                    origin.closeToExpired = lastClinicExam.closeToExpired;
                    origin.expiredDate = lastClinicExam.expiredDate;
                }
                return origin;
            });
            return data;
        });
        return {
            data: examsDataReturn,
        };
    }
    checkIfSkipEmployee(examRisk, employee) {
        if (!employee)
            return null;
        const age = this.dayjs.dayjs().diff(employee.birthday, 'years');
        const isOutOfAgeRange = (examRisk.fromAge && examRisk.fromAge > age) || (examRisk.toAge && examRisk.toAge < age);
        if (isOutOfAgeRange)
            return true;
        const isMale = employee.sex === client_1.SexTypeEnum.M;
        const isNotIncludeMale = employee.sex && isMale && !examRisk.isMale;
        const isNotIncludeFemale = employee.sex && !isMale && !examRisk.isFemale;
        if (isNotIncludeMale)
            return true;
        if (isNotIncludeFemale)
            return true;
        return false;
    }
    checkExpiredDate(examRisk, employee) {
        var _a;
        if (!employee)
            return null;
        const foundExamHistory = ((_a = employee === null || employee === void 0 ? void 0 : employee.examsHistory) === null || _a === void 0 ? void 0 : _a.find((exam) => exam.examId === examRisk.examId)) || {};
        if (!(foundExamHistory === null || foundExamHistory === void 0 ? void 0 : foundExamHistory.expiredDate) && employee.lastExam) {
            foundExamHistory.expiredDate = this.dayjs.dayjs(employee.lastExam).add((0, exports.getValidityInMonths)(employee, examRisk), 'month').toDate();
            foundExamHistory.status = client_1.StatusEnum.ACTIVE;
        }
        if (!(foundExamHistory === null || foundExamHistory === void 0 ? void 0 : foundExamHistory.expiredDate))
            return {};
        const closeValidated = examRisk.considerBetweenDays || (examRisk.exam.isAttendance ? this.clinicExamCloseToExpire : null);
        const closeToExpired = closeValidated !== null && this.dayjs.compareTime(this.dayjs.dateNow(), foundExamHistory.expiredDate, 'days') <= closeValidated;
        return {
            closeToExpired,
            expiredDate: foundExamHistory.expiredDate,
            status: foundExamHistory.status,
        };
    }
    checkCloseToExpiredDate(examsDataReturn) {
        var _a;
        const foundExam = examsDataReturn.find((exam) => { var _a; return (_a = exam === null || exam === void 0 ? void 0 : exam.exam) === null || _a === void 0 ? void 0 : _a.isAttendance; });
        if (!foundExam)
            return examsDataReturn;
        const clinicValidityInMonths = (_a = foundExam.origins.find((exam) => !exam.skipEmployee)) === null || _a === void 0 ? void 0 : _a.validityInMonths;
        return examsDataReturn.map((examsData) => {
            examsData.origins = examsData.origins.map((origin) => {
                return origin;
            });
            return examsData;
        });
    }
    async onGetAllExams(companyId, options) {
        const examRepresentAll = await this.examRepository.findNude({
            select: {
                examToRisk: {
                    where: Object.assign({ companyId, risk: { representAll: true } }, options === null || options === void 0 ? void 0 : options.examsTypes),
                },
                name: true,
                id: true,
                isAttendance: true,
            },
            where: Object.assign({ examToRisk: {
                    some: {
                        companyId: companyId,
                        risk: { representAll: true },
                    },
                } }, ((options === null || options === void 0 ? void 0 : options.onlyAttendance) && {
                isAttendance: true,
            })),
        });
        return examRepresentAll;
    }
};
FindExamByHierarchyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository,
        ExamRepository_1.ExamRepository,
        RiskDataRepository_1.RiskDataRepository,
        HierarchyRepository_1.HierarchyRepository,
        DayJSProvider_1.DayJSProvider])
], FindExamByHierarchyService);
exports.FindExamByHierarchyService = FindExamByHierarchyService;
//# sourceMappingURL=find-exam-by-hierarchy.service.js.map