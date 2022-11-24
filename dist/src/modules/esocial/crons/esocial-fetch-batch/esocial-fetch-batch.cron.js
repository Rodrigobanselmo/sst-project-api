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
exports.EsocialFetchBatchCron = void 0;
const cache_1 = require("./../../../../shared/constants/enum/cache");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const fetch_batch_events_service_1 = require("../../services/events/all/fetch-batch-events/fetch-batch-events.service");
let EsocialFetchBatchCron = class EsocialFetchBatchCron {
    constructor(cacheManager, fetchESocialBatchEventsService) {
        this.cacheManager = cacheManager;
        this.fetchESocialBatchEventsService = fetchESocialBatchEventsService;
        this.index = 0;
    }
    async handleCron() {
        const shouldSkip = await this.cacheManager.get(cache_1.CacheEnum.ESOCIAL_FETCH_EVENT);
        if (!shouldSkip) {
            console.log('FETCH NEXT');
            this.index++;
            if (this.index % 2 == 0) {
                console.log('FETCH ESOCIAL');
                const cacheValue = true;
                await this.cacheManager.set(cache_1.CacheEnum.ESOCIAL_FETCH_EVENT, cacheValue, 360);
                await this.fetchESocialBatchEventsService.execute();
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EsocialFetchBatchCron.prototype, "handleCron", null);
EsocialFetchBatchCron = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, fetch_batch_events_service_1.FetchESocialBatchEventsService])
], EsocialFetchBatchCron);
exports.EsocialFetchBatchCron = EsocialFetchBatchCron;
//# sourceMappingURL=esocial-fetch-batch.cron.js.map