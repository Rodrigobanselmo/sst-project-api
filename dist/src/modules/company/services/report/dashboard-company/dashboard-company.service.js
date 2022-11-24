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
const CompanyReportRepository_1 = require("./../../../repositories/implementations/CompanyReportRepository");
const DocumentRepository_1 = require("../../../repositories/implementations/DocumentRepository");
const find_exam_by_hierarchy_service_1 = require("../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service");
const EmployeeRepository_1 = require("../../../repositories/implementations/EmployeeRepository");
const common_1 = require("@nestjs/common");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
let DashboardCompanyService = class DashboardCompanyService {
    constructor(employeeRepository, findExamByHierarchyService, documentRepository, companyReportRepository, dayjs) {
        this.employeeRepository = employeeRepository;
        this.findExamByHierarchyService = findExamByHierarchyService;
        this.documentRepository = documentRepository;
        this.companyReportRepository = companyReportRepository;
        this.dayjs = dayjs;
    }
    async execute(findDto, user) {
        const companyId = user.targetCompanyId;
        const report = await this.companyReportRepository.findFirstNude({
            where: { companyId },
        });
        return report;
    }
};
DashboardCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository,
        find_exam_by_hierarchy_service_1.FindExamByHierarchyService,
        DocumentRepository_1.DocumentRepository,
        CompanyReportRepository_1.CompanyReportRepository,
        DayJSProvider_1.DayJSProvider])
], DashboardCompanyService);
exports.DashboardCompanyService = DashboardCompanyService;
//# sourceMappingURL=dashboard-company.service.js.map