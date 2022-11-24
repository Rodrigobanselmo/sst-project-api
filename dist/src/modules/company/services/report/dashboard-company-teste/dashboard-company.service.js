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
exports.DashboardCompanyService = void 0;
const DocumentRepository_1 = require("../../../repositories/implementations/DocumentRepository");
const find_exam_by_hierarchy_service_1 = require("../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service");
const EmployeeRepository_1 = require("../../../repositories/implementations/EmployeeRepository");
const common_1 = require("@nestjs/common");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
let DashboardCompanyService = class DashboardCompanyService {
    constructor(employeeRepository, findExamByHierarchyService, documentRepository, dayjs) {
        this.employeeRepository = employeeRepository;
        this.findExamByHierarchyService = findExamByHierarchyService;
        this.documentRepository = documentRepository;
        this.dayjs = dayjs;
    }
    async execute(UpsertContactsDto, user) {
        const companyId = user.targetCompanyId;
        const total = await this.employeeRepository.findNude({
            where: { companyId },
        });
        const missingExam = await this.employeeRepository.findNude({
            where: { companyId, examsHistory: { none: { id: { gte: 0 } } } },
            select: {
                id: true,
                name: true,
                lastExam: true,
                hierarchyId: true,
                subOffices: { select: { id: true } },
            },
        });
        const withExam = await this.employeeRepository.findNude({
            where: { companyId, examsHistory: { some: { id: { gt: 0 } } } },
            include: { examsHistory: { where: { exam: { isAttendance: true } } } },
        });
        const withExamAndExpired = await this.employeeRepository.findNude({
            where: {
                companyId,
                examsHistory: {
                    some: { id: { gt: 0 } },
                    none: {
                        expiredDate: { gt: this.dayjs.dateNow() },
                        exam: { isAttendance: true },
                    },
                },
            },
        });
        const withExamAndSchedule = await this.employeeRepository.findNude({
            where: {
                companyId,
                examsHistory: {
                    some: {
                        id: { gt: 0 },
                        doneDate: { gte: this.dayjs.dateNow() },
                        status: { in: ['PENDING', 'PROCESSING'] },
                        exam: { isAttendance: true },
                    },
                },
            },
        });
        const exams = await this.findExamByHierarchyService.execute(user, {
            onlyAttendance: true,
        });
        const getExpired = missingExam.map((employee) => {
            const ids = [...employee.subOffices.map(({ id }) => id), employee.hierarchyId];
            let expiredDate;
            exams.data.find(({ exam, origins }) => {
                if (!exam.isAttendance)
                    return false;
                origins.find((origin) => {
                    var _a, _b;
                    const isPartOfHomo = (origin === null || origin === void 0 ? void 0 : origin.homogeneousGroup)
                        ? (_b = (_a = origin.homogeneousGroup) === null || _a === void 0 ? void 0 : _a.hierarchyOnHomogeneous) === null || _b === void 0 ? void 0 : _b.find((homoHier) => { var _a; return ids.includes((_a = homoHier === null || homoHier === void 0 ? void 0 : homoHier.hierarchy) === null || _a === void 0 ? void 0 : _a.id); })
                        : true;
                    if (!isPartOfHomo)
                        return;
                    const skip = this.findExamByHierarchyService.checkIfSkipEmployee(origin, employee);
                    if (skip)
                        return;
                    const expired = this.findExamByHierarchyService.checkExpiredDate(origin, employee);
                    if (!expired.expiredDate)
                        return;
                    expiredDate = expired.expiredDate;
                    return true;
                });
            });
            const expired = expiredDate ? { expiredDate } : {};
            return Object.assign(Object.assign({}, employee), expired);
        });
        const missingExamExpired = getExpired.filter((e) => {
            if (!e.expiredDate)
                return true;
            const lastExamValid = this.dayjs.dayjs(e.expiredDate).isAfter(this.dayjs.dayjs());
            if (!lastExamValid)
                return true;
            return false;
        });
        return {
            exams: {
                exams: exams.data,
                total,
                withExam,
                withExamAndSchedule,
                missingExam,
                expired: { missingExamExpired, withExamAndExpired },
            },
        };
    }
};
DashboardCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository,
        find_exam_by_hierarchy_service_1.FindExamByHierarchyService,
        DocumentRepository_1.DocumentRepository,
        DayJSProvider_1.DayJSProvider])
], DashboardCompanyService);
exports.DashboardCompanyService = DashboardCompanyService;
//# sourceMappingURL=dashboard-company.service.js.map