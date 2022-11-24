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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEvents2220ESocialService = void 0;
const data_sort_1 = require("./../../../../../../shared/utils/sorts/data.sort");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const stream_1 = require("stream");
const CompanyReportRepository_1 = require("../../../../../../modules/company/repositories/implementations/CompanyReportRepository");
const DayJSProvider_1 = require("../../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const ESocialEventProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const ESocialMethodsProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider");
const CompanyRepository_1 = require("../../../../../company/repositories/implementations/CompanyRepository");
const EmployeeExamsHistoryRepository_1 = require("../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository");
const EmployeeRepository_1 = require("../../../../../company/repositories/implementations/EmployeeRepository");
const cache_1 = require("./../../../../../../shared/constants/enum/cache");
const update_esocial_report_service_1 = require("./../../../../../company/services/report/update-esocial-report/update-esocial-report.service");
const ESocialBatchRepository_1 = require("./../../../../repositories/implementations/ESocialBatchRepository");
let SendEvents2220ESocialService = class SendEvents2220ESocialService {
    constructor(cacheManager, eSocialEventProvider, eSocialMethodsProvider, employeeExamHistoryRepository, employeeRepository, companyRepository, companyReportRepository, updateESocialReportService, eSocialBatchRepository, dayJSProvider) {
        this.cacheManager = cacheManager;
        this.eSocialEventProvider = eSocialEventProvider;
        this.eSocialMethodsProvider = eSocialMethodsProvider;
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.companyReportRepository = companyReportRepository;
        this.updateESocialReportService = updateESocialReportService;
        this.eSocialBatchRepository = eSocialBatchRepository;
        this.dayJSProvider = dayJSProvider;
    }
    async execute(body, user) {
        const companyId = user.targetCompanyId;
        const { company, cert } = await this.eSocialMethodsProvider.getCompany(companyId, { cert: true, report: true, doctor: true });
        const startDate = company.esocialStart;
        const esocialSend = company.esocialSend;
        if (!startDate || esocialSend == null)
            throw new common_1.BadRequestException('Data de início do eSocial ou tipo de envio não informado para essa empresa');
        const { data: employees } = await this.employeeRepository.findEvent2220({
            startDate,
            companyId,
        }, { take: 1000 });
        const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(company, employees, { ideEvento: body });
        const excludeEvents = eventsStruct.filter((event) => {
            var _a, _b, _c;
            return ((_a = event.aso) === null || _a === void 0 ? void 0 : _a.status) === 'CANCELED' && ((_c = (_b = event.aso) === null || _b === void 0 ? void 0 : _b.events) === null || _c === void 0 ? void 0 : _c.find((e) => e.receipt));
        });
        const excludeEntry = excludeEvents.map((event) => {
            var _a, _b, _c;
            const eventAso = (_c = (_b = (_a = event.aso) === null || _a === void 0 ? void 0 : _a.events) === null || _b === void 0 ? void 0 : _b.sort((b, a) => (0, data_sort_1.sortData)(a, b))) === null || _c === void 0 ? void 0 : _c.find((e) => e.receipt);
            return {
                cpf: event.employee.cpf,
                eventType: client_1.EmployeeESocialEventTypeEnum.EXAM_2220,
                receipt: eventAso === null || eventAso === void 0 ? void 0 : eventAso.receipt,
                employee: event.employee,
                aso: event.aso,
            };
        });
        await this.eSocialEventProvider.sendExclusionToESocial({
            body,
            cert,
            company,
            events: excludeEntry,
            type: client_1.EmployeeESocialEventTypeEnum.EXAM_2220,
            user,
            esocialSend,
        });
        const eventsXml = eventsStruct
            .map((_a) => {
            var _b;
            var { event } = _a, data = __rest(_a, ["event"]);
            const canceled = ((_b = data.aso) === null || _b === void 0 ? void 0 : _b.status) == 'CANCELED';
            if (canceled)
                return;
            const errors = this.eSocialEventProvider.errorsEvent2220(event);
            if (errors.length > 0)
                return;
            const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(event);
            const signedXml = esocialSend
                ? this.eSocialMethodsProvider.signEvent({
                    xml: xmlResult,
                    cert,
                })
                : '';
            return Object.assign({ signedXml, xml: xmlResult }, data);
        })
            .filter((i) => i);
        const sendEventResponse = esocialSend
            ? await this.eSocialEventProvider.sendEventToESocial(eventsXml, {
                company,
                environment: body === null || body === void 0 ? void 0 : body.tpAmb,
            })
            : [
                {
                    events: eventsXml,
                    response: {
                        status: { cdResposta: '201' },
                    },
                },
            ];
        await this.eSocialEventProvider.saveDatabaseBatchEvent({
            body,
            user,
            company,
            esocialSend,
            type: client_1.EmployeeESocialEventTypeEnum.EXAM_2220,
            sendEvents: sendEventResponse,
        });
        const cacheValue = false;
        await this.cacheManager.set(cache_1.CacheEnum.ESOCIAL_FETCH_EVENT, cacheValue, 360);
        await this.updateESocialReportService.execute({ companyId });
        if (esocialSend)
            return { fileStream: null, fileName: '' };
        const { zipFile, fileName } = await this.eSocialMethodsProvider.createZipFolder({
            company,
            eventsXml,
            type: '2220',
        });
        return { fileStream: stream_1.Readable.from(zipFile), fileName };
    }
};
SendEvents2220ESocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, ESocialEventProvider_1.ESocialEventProvider,
        ESocialMethodsProvider_1.ESocialMethodsProvider,
        EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository,
        EmployeeRepository_1.EmployeeRepository,
        CompanyRepository_1.CompanyRepository,
        CompanyReportRepository_1.CompanyReportRepository,
        update_esocial_report_service_1.UpdateESocialReportService,
        ESocialBatchRepository_1.ESocialBatchRepository,
        DayJSProvider_1.DayJSProvider])
], SendEvents2220ESocialService);
exports.SendEvents2220ESocialService = SendEvents2220ESocialService;
//# sourceMappingURL=send-events.service.js.map