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
exports.ESocialEventController = void 0;
const openapi = require("@nestjs/swagger");
const fetch_batch_events_service_1 = require("./../../../services/events/all/fetch-batch-events/fetch-batch-events.service");
const esocial_batch_dto_1 = require("./../../../dto/esocial-batch.dto");
const find_events_service_1 = require("./../../../services/events/all/find-events/find-events.service");
const esocial_event_dto_1 = require("./../../../dto/esocial-event.dto");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../../../../shared/decorators/public.decorator");
const user_decorator_1 = require("../../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../../shared/dto/user-payload.dto");
const pfx_filters_1 = require("../../../../../shared/utils/filters/pfx.filters");
const add_cert_dto_1 = require("../../../dto/add-cert.dto");
const add_certificate_service_1 = require("../../../services/events/all/add-certificate/add-certificate.service");
const send_batch_service_1 = require("../../../services/events/all/send-batch/send-batch.service");
const find_batch_service_1 = require("../../../../../modules/esocial/services/events/all/find-batch/find-batch.service");
let ESocialEventController = class ESocialEventController {
    constructor(addCertificationESocialService, sendBatchESocialService, findESocialEventService, findESocialBatchService, fetchESocialBatchEventsService) {
        this.addCertificationESocialService = addCertificationESocialService;
        this.sendBatchESocialService = sendBatchESocialService;
        this.findESocialEventService = findESocialEventService;
        this.findESocialBatchService = findESocialBatchService;
        this.fetchESocialBatchEventsService = fetchESocialBatchEventsService;
    }
    addCert(file, user, body) {
        return this.addCertificationESocialService.execute(file, body, user);
    }
    sendBatch() {
        return this.sendBatchESocialService.execute();
    }
    fetch() {
        return this.fetchESocialBatchEventsService.execute();
    }
    findEvents(userPayloadDto, query) {
        return this.findESocialEventService.execute(query, userPayloadDto);
    }
    findBatch(userPayloadDto, query) {
        return this.findESocialBatchService.execute(query, userPayloadDto);
    }
};
__decorate([
    (0, common_1.Post)('certificate'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { fileFilter: pfx_filters_1.pfxFileFilter })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, add_cert_dto_1.AddCertDto]),
    __metadata("design:returntype", void 0)
], ESocialEventController.prototype, "addCert", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('send-batch'),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ESocialEventController.prototype, "sendBatch", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('fetch-batch'),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ESocialEventController.prototype, "fetch", null);
__decorate([
    (0, common_1.Get)('events/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, esocial_event_dto_1.FindESocialEventDto]),
    __metadata("design:returntype", void 0)
], ESocialEventController.prototype, "findEvents", null);
__decorate([
    (0, common_1.Get)('batch/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, esocial_batch_dto_1.FindESocialBatchDto]),
    __metadata("design:returntype", void 0)
], ESocialEventController.prototype, "findBatch", null);
ESocialEventController = __decorate([
    (0, swagger_1.ApiTags)('events'),
    (0, common_1.Controller)('esocial/events/all'),
    __metadata("design:paramtypes", [add_certificate_service_1.AddCertificationESocialService,
        send_batch_service_1.SendBatchESocialService,
        find_events_service_1.FindESocialEventService,
        find_batch_service_1.FindESocialBatchService,
        fetch_batch_events_service_1.FetchESocialBatchEventsService])
], ESocialEventController);
exports.ESocialEventController = ESocialEventController;
//# sourceMappingURL=events.controller.js.map