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
exports.ESocialEvent2220Controller = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const find_events_service_1 = require("../../../../../modules/esocial/services/events/2220/find-events/find-events.service");
const user_decorator_1 = require("../../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("./../../../../../shared/dto/user-payload.dto");
const event_dto_1 = require("./../../../dto/event.dto");
const send_events_service_1 = require("./../../../services/events/2220/send-events/send-events.service");
let ESocialEvent2220Controller = class ESocialEvent2220Controller {
    constructor(sendEvents2220ESocialService, findEvents2220ESocialService) {
        this.sendEvents2220ESocialService = sendEvents2220ESocialService;
        this.findEvents2220ESocialService = findEvents2220ESocialService;
    }
    find(query, userPayloadDto) {
        return this.findEvents2220ESocialService.execute(query, userPayloadDto);
    }
    async sendBatch(res, body, userPayloadDto) {
        const { fileStream, fileName } = await this.sendEvents2220ESocialService.execute(body, userPayloadDto);
        if (!fileStream)
            return res.status(200).send('Lotes enviados com sucessos');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.zip`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
};
__decorate([
    (0, common_1.Get)(':companyId?'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.FindEvents2220Dto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], ESocialEvent2220Controller.prototype, "find", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, event_dto_1.Event2220Dto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], ESocialEvent2220Controller.prototype, "sendBatch", null);
ESocialEvent2220Controller = __decorate([
    (0, swagger_1.ApiTags)('events-2220'),
    (0, common_1.Controller)('esocial/events/2220'),
    __metadata("design:paramtypes", [send_events_service_1.SendEvents2220ESocialService, find_events_service_1.FindEvents2220ESocialService])
], ESocialEvent2220Controller);
exports.ESocialEvent2220Controller = ESocialEvent2220Controller;
//# sourceMappingURL=events-2220.controller.js.map