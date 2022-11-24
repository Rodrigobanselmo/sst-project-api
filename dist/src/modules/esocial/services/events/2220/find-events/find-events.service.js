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
exports.FindEvents2220ESocialService = void 0;
const common_1 = require("@nestjs/common");
const esocial_1 = require("../../../../../../shared/constants/enum/esocial");
const ESocialEventProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const ESocialMethodsProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider");
const CompanyRepository_1 = require("../../../../../company/repositories/implementations/CompanyRepository");
const EmployeeRepository_1 = require("../../../../../company/repositories/implementations/EmployeeRepository");
const event_2220_1 = require("./../../../../interfaces/event-2220");
let FindEvents2220ESocialService = class FindEvents2220ESocialService {
    constructor(eSocialEventProvider, eSocialMethodsProvider, employeeRepository, companyRepository) {
        this.eSocialEventProvider = eSocialEventProvider;
        this.eSocialMethodsProvider = eSocialMethodsProvider;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
    }
    async execute(_a, user) {
        var { skip, take } = _a, query = __rest(_a, ["skip", "take"]);
        const companyId = user.targetCompanyId;
        const { company } = await this.eSocialMethodsProvider.getCompany(companyId, { doctor: true });
        const startDate = company.esocialStart;
        const esocialSend = company.esocialSend;
        if (!startDate || esocialSend === null)
            return {
                data: [],
                count: 0,
                error: {
                    message: 'Data de início do eSocial ou tipo de envio não informado para essa empresa',
                },
            };
        const { data: employees, count } = await this.employeeRepository.findEvent2220(Object.assign({ startDate,
            companyId }, query), { take: 1000 }, { select: { name: true } });
        const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(company, employees);
        const eventsXml = eventsStruct.map((data) => {
            var _a, _b, _c, _d, _e, _f;
            const eventErrors = this.eSocialEventProvider.errorsEvent2220(data.event);
            const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(data.event);
            const company = (_a = data.employee) === null || _a === void 0 ? void 0 : _a.company;
            (_b = data.employee) === null || _b === void 0 ? true : delete _b.company;
            let type = esocial_1.ESocialSendEnum.SEND;
            if ((_d = (_c = data.aso) === null || _c === void 0 ? void 0 : _c.events) === null || _d === void 0 ? void 0 : _d.some((e) => ['DONE', 'TRANSMITTED'].includes(e.status))) {
                const isExclude = data.aso.status === 'CANCELED';
                if (isExclude)
                    type = esocial_1.ESocialSendEnum.EXCLUDE;
                if (!isExclude)
                    type = esocial_1.ESocialSendEnum.MODIFIED;
            }
            return {
                company,
                doneDate: data.event.exMedOcup.aso.dtAso,
                examType: event_2220_1.mapInverseResAso[(_e = data.event.exMedOcup) === null || _e === void 0 ? void 0 : _e.tpExameOcup],
                evaluationType: event_2220_1.mapInverseTpExameOcup[(_f = data.event.exMedOcup.aso) === null || _f === void 0 ? void 0 : _f.resAso],
                errors: eventErrors,
                employee: data.employee,
                type,
                xml: xmlResult,
            };
        });
        return { data: eventsXml, count };
    }
};
FindEvents2220ESocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ESocialEventProvider_1.ESocialEventProvider,
        ESocialMethodsProvider_1.ESocialMethodsProvider,
        EmployeeRepository_1.EmployeeRepository,
        CompanyRepository_1.CompanyRepository])
], FindEvents2220ESocialService);
exports.FindEvents2220ESocialService = FindEvents2220ESocialService;
//# sourceMappingURL=find-events.service.js.map