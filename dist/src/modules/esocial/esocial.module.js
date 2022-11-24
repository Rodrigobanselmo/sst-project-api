"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EsocialModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const nestjs_soap_1 = require("nestjs-soap");
const DayJSProvider_1 = require("../../shared/providers/DateProvider/implementations/DayJSProvider");
const ESocialEventProvider_1 = require("../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const ESocialMethodsProvider_1 = require("../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider");
const auth_module_1 = require("../auth/auth.module");
const company_module_1 = require("../company/company.module");
const sst_module_1 = require("../sst/sst.module");
const soapClient_1 = require("./../../shared/constants/enum/soapClient");
const events_2220_controller_1 = require("./controller/events/2220/events-2220.controller");
const events_2240_controller_1 = require("./controller/events/2240/events-2240.controller");
const events_controller_1 = require("./controller/events/all/events.controller");
const tables_controller_1 = require("./controller/tables/tables.controller");
const esocial_fetch_batch_cron_1 = require("./crons/esocial-fetch-batch/esocial-fetch-batch.cron");
const CompanyCertRepository_1 = require("./repositories/implementations/CompanyCertRepository");
const ESocial27TableRepository_1 = require("./repositories/implementations/ESocial27TableRepository");
const ESocialBatchRepository_1 = require("./repositories/implementations/ESocialBatchRepository");
const ESocialEventRepository_1 = require("./repositories/implementations/ESocialEventRepository");
const find_events_service_1 = require("./services/events/2220/find-events/find-events.service");
const send_events_service_1 = require("./services/events/2220/send-events/send-events.service");
const find_events_service_2 = require("./services/events/2240/find-events/find-events.service");
const send_events_service_2 = require("./services/events/2240/send-events/send-events.service");
const add_certificate_service_1 = require("./services/events/all/add-certificate/add-certificate.service");
const fetch_batch_events_service_1 = require("./services/events/all/fetch-batch-events/fetch-batch-events.service");
const find_batch_service_1 = require("./services/events/all/find-batch/find-batch.service");
const find_events_service_3 = require("./services/events/all/find-events/find-events.service");
const send_batch_service_1 = require("./services/events/all/send-batch/send-batch.service");
const find_all_27_service_1 = require("./services/tables/find-all-27.service");
let EsocialModule = class EsocialModule {
};
EsocialModule = __decorate([
    (0, common_1.Module)({
        controllers: [tables_controller_1.TablesController, events_controller_1.ESocialEventController, events_2220_controller_1.ESocialEvent2220Controller, events_2240_controller_1.ESocialEvent2240Controller],
        exports: [ESocialEventProvider_1.ESocialEventProvider],
        imports: [
            nestjs_soap_1.SoapModule.forRootAsync({
                clientName: soapClient_1.SoapClientEnum.PRODUCTION_RESTRICT,
                useFactory: async () => {
                    const httpsAgent = new https_1.default.Agent({
                        rejectUnauthorized: false,
                        pfx: fs_1.default.readFileSync('cert/cert.pfx'),
                        passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
                    });
                    const api = axios_1.default.create({
                        httpsAgent,
                    });
                    return {
                        clientName: soapClient_1.SoapClientEnum.PRODUCTION_RESTRICT,
                        uri: process.env.ESOCIAL_URL_PROD_RESTRICT,
                        clientOptions: { request: api, escapeXML: false },
                    };
                },
            }),
            nestjs_soap_1.SoapModule.forRootAsync({
                clientName: soapClient_1.SoapClientEnum.PRODUCTION,
                useFactory: async () => {
                    const httpsAgent = new https_1.default.Agent({
                        rejectUnauthorized: false,
                        pfx: fs_1.default.readFileSync('cert/cert.pfx'),
                        passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
                    });
                    const api = axios_1.default.create({
                        httpsAgent,
                    });
                    return {
                        clientName: soapClient_1.SoapClientEnum.PRODUCTION,
                        uri: process.env.ESOCIAL_URL_PROD,
                        clientOptions: { request: api, escapeXML: false },
                    };
                },
            }),
            nestjs_soap_1.SoapModule.forRootAsync({
                clientName: soapClient_1.SoapClientEnum.CONSULT_PRODUCTION_RESTRICT,
                useFactory: async () => {
                    const httpsAgent = new https_1.default.Agent({
                        rejectUnauthorized: false,
                        pfx: fs_1.default.readFileSync('cert/cert.pfx'),
                        passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
                    });
                    const api = axios_1.default.create({
                        httpsAgent,
                    });
                    return {
                        clientName: soapClient_1.SoapClientEnum.CONSULT_PRODUCTION_RESTRICT,
                        uri: process.env.ESOCIAL_CONSULT_URL_PROD_RESTRICT,
                        clientOptions: { request: api, escapeXML: false },
                    };
                },
            }),
            nestjs_soap_1.SoapModule.forRootAsync({
                clientName: soapClient_1.SoapClientEnum.CONSULT_PRODUCTION,
                useFactory: async () => {
                    const httpsAgent = new https_1.default.Agent({
                        rejectUnauthorized: false,
                        pfx: fs_1.default.readFileSync('cert/cert.pfx'),
                        passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
                    });
                    const api = axios_1.default.create({
                        httpsAgent,
                    });
                    return {
                        clientName: soapClient_1.SoapClientEnum.CONSULT_PRODUCTION,
                        uri: process.env.ESOCIAL_CONSULT_URL_PROD,
                        clientOptions: { request: api, escapeXML: false },
                    };
                },
            }),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => company_module_1.CompanyModule),
            (0, common_1.forwardRef)(() => sst_module_1.SSTModule),
            common_1.CacheModule.register(),
        ],
        providers: [
            fetch_batch_events_service_1.FetchESocialBatchEventsService,
            ESocialMethodsProvider_1.ESocialMethodsProvider,
            ESocialEventProvider_1.ESocialEventProvider,
            find_all_27_service_1.FindAllTable27Service,
            add_certificate_service_1.AddCertificationESocialService,
            send_batch_service_1.SendBatchESocialService,
            DayJSProvider_1.DayJSProvider,
            send_events_service_1.SendEvents2220ESocialService,
            CompanyCertRepository_1.CompanyCertRepository,
            ESocial27TableRepository_1.ESocial27TableRepository,
            find_events_service_1.FindEvents2220ESocialService,
            ESocialBatchRepository_1.ESocialBatchRepository,
            find_batch_service_1.FindESocialBatchService,
            find_events_service_3.FindESocialEventService,
            ESocialEventRepository_1.ESocialEventRepository,
            esocial_fetch_batch_cron_1.EsocialFetchBatchCron,
            find_events_service_2.FindEvents2240ESocialService,
            send_events_service_2.SendEvents2240ESocialService,
        ],
    })
], EsocialModule);
exports.EsocialModule = EsocialModule;
//# sourceMappingURL=esocial.module.js.map