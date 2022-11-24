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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchESocialBatchEventsService = void 0;
const prisma_service_1 = require("./../../../../../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const ESocialEventRepository_1 = require("../../../../../../modules/esocial/repositories/implementations/ESocialEventRepository");
const ESocialEventProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const arrayChunks_1 = require("../../../../../../shared/utils/arrayChunks");
const removeDuplicate_1 = require("../../../../../../shared/utils/removeDuplicate");
const EmployeeExamsHistoryRepository_1 = require("../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository");
const ESocialBatchRepository_1 = require("../../../../repositories/implementations/ESocialBatchRepository");
const cache_1 = require("./../../../../../../shared/constants/enum/cache");
const asyncEach_1 = require("./../../../../../../shared/utils/asyncEach");
const update_esocial_report_service_1 = require("./../../../../../company/services/report/update-esocial-report/update-esocial-report.service");
let FetchESocialBatchEventsService = class FetchESocialBatchEventsService {
    constructor(cacheManager, eSocialEventProvider, employeeExamHistoryRepository, eSocialBatchRepository, eSocialEventRepository, updateESocialReportService, prisma) {
        this.cacheManager = cacheManager;
        this.eSocialEventProvider = eSocialEventProvider;
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.eSocialBatchRepository = eSocialBatchRepository;
        this.eSocialEventRepository = eSocialEventRepository;
        this.updateESocialReportService = updateESocialReportService;
        this.prisma = prisma;
    }
    async execute() {
        let isInProgress = false;
        const batches = await this.eSocialBatchRepository.findNude({
            where: {
                events: { some: { status: 'PROCESSING' } },
                status: 'DONE',
            },
            select: {
                id: true,
                protocolId: true,
                response: true,
                companyId: true,
                environment: true,
            },
            orderBy: { created_at: 'desc' },
        });
        if (batches.length > 0) {
            await (0, asyncEach_1.asyncEach)((0, arrayChunks_1.arrayChunks)(batches, 20), async (batchChunk) => {
                await Promise.all(batchChunk.map(async (batch) => {
                    var _a, _b, _c;
                    let response;
                    try {
                        const batchResponse = await this.eSocialEventProvider.fetchEventToESocial(batch);
                        response = batchResponse.response;
                        const status = (_a = batchResponse.response) === null || _a === void 0 ? void 0 : _a.status;
                        const inProgress = (status === null || status === void 0 ? void 0 : status.cdResposta) == '101';
                        if (inProgress) {
                            isInProgress = true;
                            return;
                        }
                        const rejectedBatch = !['101', '201', '202'].includes(status === null || status === void 0 ? void 0 : status.cdResposta);
                        if (rejectedBatch)
                            throw new Error('Erro ao consultar lote');
                        response = undefined;
                        const eventsResponse = (_c = (_b = batchResponse.response) === null || _b === void 0 ? void 0 : _b.retornoEventos) === null || _c === void 0 ? void 0 : _c.evento;
                        const eventsResponseArray = Array.isArray(eventsResponse) ? eventsResponse : [eventsResponse];
                        await Promise.all(eventsResponseArray.map(async (eventResponse) => {
                            var _a, _b;
                            try {
                                const id = eventResponse.attributes.Id;
                                const event = (_b = (_a = eventResponse === null || eventResponse === void 0 ? void 0 : eventResponse.retornoEvento) === null || _a === void 0 ? void 0 : _a.eSocial) === null || _b === void 0 ? void 0 : _b.retornoEvento;
                                const process = event === null || event === void 0 ? void 0 : event.processamento;
                                const inProgress = (process === null || process === void 0 ? void 0 : process.cdResposta) == '101';
                                if (inProgress) {
                                    isInProgress = true;
                                    return;
                                }
                                const rejectedEvent = !['101', '201', '202'].includes(process === null || process === void 0 ? void 0 : process.cdResposta);
                                const found = await this.eSocialEventRepository.findFirstNude({
                                    where: { eventId: id },
                                    select: { id: true, examHistoryId: true, pppId: true },
                                });
                                if (!found)
                                    throw new Error(`Event not found ID:${id}`);
                                await this.eSocialEventRepository.updateNude({
                                    where: { id: found.id },
                                    data: Object.assign(Object.assign(Object.assign({ status: rejectedEvent ? 'INVALID' : 'DONE', response: process }, (found.examHistoryId && {
                                        exam: { update: { sendEvent: rejectedEvent } },
                                    })), (rejectedEvent &&
                                        found.pppId && {
                                        ppp: { update: { sendEvent: true, status: 'INVALID', json: null } },
                                    })), (!rejectedEvent &&
                                        found.pppId && {
                                        ppp: { update: { status: 'DONE' } },
                                    })),
                                });
                            }
                            catch (err) {
                                console.log('error on process event', err);
                            }
                        }));
                    }
                    catch (err) {
                        await this.eSocialBatchRepository.updateNude({
                            where: { id: batch.id },
                            select: {},
                            data: {
                                response: response,
                                status: 'INVALID',
                            },
                        });
                        await this.eSocialEventRepository.updateManyNude({
                            where: { batchId: { in: batchChunk.map((batch) => batch.id) } },
                            data: {
                                status: 'ERROR',
                                response: (response === null || response === void 0 ? void 0 : response.status) || (err === null || err === void 0 ? void 0 : err.message.slice(0, 500)),
                                eventId: null,
                            },
                        });
                        await this.employeeExamHistoryRepository.updateManyNude({
                            where: {
                                events: {
                                    some: {
                                        batchId: { in: batchChunk.map((batch) => batch.id) },
                                    },
                                },
                            },
                            data: { sendEvent: true },
                        });
                    }
                }));
            });
            await Promise.all((0, removeDuplicate_1.removeDuplicate)(batches, { removeById: 'companyId' }).map(async (batch) => {
                const companyId = batch.companyId;
                await this.updateESocialReportService.execute({ companyId });
            }));
            if (!isInProgress) {
                const cacheValue = true;
                await this.cacheManager.set(cache_1.CacheEnum.ESOCIAL_FETCH_EVENT, cacheValue, 360);
            }
        }
        return;
    }
};
FetchESocialBatchEventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, ESocialEventProvider_1.ESocialEventProvider,
        EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository,
        ESocialBatchRepository_1.ESocialBatchRepository,
        ESocialEventRepository_1.ESocialEventRepository,
        update_esocial_report_service_1.UpdateESocialReportService,
        prisma_service_1.PrismaService])
], FetchESocialBatchEventsService);
exports.FetchESocialBatchEventsService = FetchESocialBatchEventsService;
//# sourceMappingURL=fetch-batch-events.service.js.map