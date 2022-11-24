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
exports.UpdateESocialReportService = void 0;
const common_1 = require("@nestjs/common");
const ESocialEventProvider_1 = require("../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const CompanyReportRepository_1 = require("../../../repositories/implementations/CompanyReportRepository");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
const EmployeeRepository_1 = require("../../../repositories/implementations/EmployeeRepository");
let UpdateESocialReportService = class UpdateESocialReportService {
    constructor(employeeRepository, companyRepository, eSocialEventProvider, companyReportRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.eSocialEventProvider = eSocialEventProvider;
        this.companyReportRepository = companyReportRepository;
    }
    async execute({ companyId }) {
        const company = await this.companyRepository.findFirstNude({
            select: {
                id: true,
                esocialStart: true,
                cnpj: true,
                group: {
                    select: {
                        esocialStart: true,
                    },
                },
            },
            where: {
                status: 'ACTIVE',
                isClinic: false,
                id: companyId,
            },
        });
        const esocial = await this.addCompanyEsocial(company);
        const report = await this.companyReportRepository.updateESocialReport(companyId, {
            esocial: esocial,
        });
        return report;
    }
    async addCompanyEsocial(company) {
        const companyId = company.id;
        if (!company.esocialStart)
            return {};
        const { data: employees } = await this.employeeRepository.findEvent2220({
            startDate: company.esocialStart,
            companyId,
        }, { take: 100 });
        const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(company, employees);
        const esocial = await this.companyReportRepository.getESocialNewReport(companyId);
        esocial.S2220.pending = eventsStruct.length;
        const employees2240 = await this.employeeRepository.countNude({
            where: {
                companyId,
                OR: [{ pppHistory: { none: { status: { in: ['DONE', 'TRANSMITTED'] } } } }, { pppHistory: { some: { sendEvent: true } } }],
            },
        });
        esocial.S2240.pending = employees2240;
        return esocial;
    }
};
UpdateESocialReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository,
        CompanyRepository_1.CompanyRepository,
        ESocialEventProvider_1.ESocialEventProvider,
        CompanyReportRepository_1.CompanyReportRepository])
], UpdateESocialReportService);
exports.UpdateESocialReportService = UpdateESocialReportService;
//# sourceMappingURL=update-esocial-report.service.js.map