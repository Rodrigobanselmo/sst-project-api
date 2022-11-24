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
exports.SendEvents2240ESocialService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const stream_1 = require("stream");
const EmployeePPPHistoryRepository_1 = require("../../../../../../modules/company/repositories/implementations/EmployeePPPHistoryRepository");
const cache_1 = require("../../../../../../shared/constants/enum/cache");
const DayJSProvider_1 = require("../../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const ESocialEventProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const ESocialMethodsProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider");
const CompanyReportRepository_1 = require("../../../../../company/repositories/implementations/CompanyReportRepository");
const CompanyRepository_1 = require("../../../../../company/repositories/implementations/CompanyRepository");
const EmployeeRepository_1 = require("../../../../../company/repositories/implementations/EmployeeRepository");
const update_esocial_report_service_1 = require("../../../../../company/services/report/update-esocial-report/update-esocial-report.service");
const ESocialBatchRepository_1 = require("../../../../repositories/implementations/ESocialBatchRepository");
const find_events_service_1 = require("../find-events/find-events.service");
let SendEvents2240ESocialService = class SendEvents2240ESocialService {
    constructor(cacheManager, eSocialEventProvider, eSocialMethodsProvider, employeePPPHistoryRepository, employeeRepository, companyRepository, companyReportRepository, updateESocialReportService, eSocialBatchRepository, dayJSProvider, findEvents2240ESocialService) {
        this.cacheManager = cacheManager;
        this.eSocialEventProvider = eSocialEventProvider;
        this.eSocialMethodsProvider = eSocialMethodsProvider;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.companyReportRepository = companyReportRepository;
        this.updateESocialReportService = updateESocialReportService;
        this.eSocialBatchRepository = eSocialBatchRepository;
        this.dayJSProvider = dayJSProvider;
        this.findEvents2240ESocialService = findEvents2240ESocialService;
    }
    async execute(body, user) {
        const companyId = user.targetCompanyId;
        const { company, cert } = await this.findEvents2240ESocialService.getCompany(companyId, { report: true, cert: true });
        const startDate = company.esocialStart;
        const esocialSend = company.esocialSend;
        if (!startDate || esocialSend == null)
            throw new common_1.BadRequestException('Data de início do eSocial ou tipo de envio não informado para essa empresa');
        const employees2240 = await this.findEvents2240ESocialService.findEmployee2240(company);
        const eventsStruct = this.eSocialEventProvider.convertToEvent2240Struct({ company, employees: employees2240 });
        const excludeEvents = eventsStruct.filter((e) => e.isExclude && e.receipt);
        const excludeEntry = excludeEvents.map((event) => {
            const receipt = event.receipt;
            return {
                cpf: event.employee.cpf,
                eventType: client_1.EmployeeESocialEventTypeEnum.RISK_2240,
                receipt: receipt,
                employee: event.employee,
                ppp: event.ppp,
            };
        });
        await this.eSocialEventProvider.sendExclusionToESocial({
            body,
            cert,
            company,
            events: excludeEntry,
            type: client_1.EmployeeESocialEventTypeEnum.RISK_2240,
            user,
            esocialSend,
        });
        const errorsEventsPPP = [];
        const eventsXml = eventsStruct
            .map((_a) => {
            var { event } = _a, data = __rest(_a, ["event"]);
            if (data.isExclude)
                return;
            const errors = this.eSocialEventProvider.errorsEvent2240(event);
            if (errors.length > 0) {
                errorsEventsPPP.push(Object.assign({ event }, data));
                return;
            }
            const xmlResult = this.eSocialEventProvider.generateXmlEvent2240(event);
            const signedXml = esocialSend
                ? this.eSocialMethodsProvider.signEvent({
                    xml: xmlResult,
                    cert,
                })
                : '';
            return Object.assign({ signedXml, xml: xmlResult }, data);
        })
            .filter((i) => i);
        await this.employeePPPHistoryRepository.upsertManyNude(errorsEventsPPP.map((ev) => {
            return {
                create: {
                    sendEvent: true,
                    employeeId: ev.employee.id,
                    doneDate: ev.eventDate,
                    status: client_1.StatusEnum.INVALID,
                },
                update: {
                    sendEvent: true,
                    status: client_1.StatusEnum.INVALID,
                },
                where: {
                    employeeId_doneDate: {
                        employeeId: ev.employee.id,
                        doneDate: ev.eventDate,
                    },
                },
            };
        }));
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
            type: client_1.EmployeeESocialEventTypeEnum.RISK_2240,
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
            type: '2240',
        });
        return { fileStream: stream_1.Readable.from(zipFile), fileName };
    }
};
SendEvents2240ESocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, ESocialEventProvider_1.ESocialEventProvider,
        ESocialMethodsProvider_1.ESocialMethodsProvider,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository,
        EmployeeRepository_1.EmployeeRepository,
        CompanyRepository_1.CompanyRepository,
        CompanyReportRepository_1.CompanyReportRepository,
        update_esocial_report_service_1.UpdateESocialReportService,
        ESocialBatchRepository_1.ESocialBatchRepository,
        DayJSProvider_1.DayJSProvider,
        find_events_service_1.FindEvents2240ESocialService])
], SendEvents2240ESocialService);
exports.SendEvents2240ESocialService = SendEvents2240ESocialService;
//# sourceMappingURL=send-events.service.js.map