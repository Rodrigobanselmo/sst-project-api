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
exports.ProtocolController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const protocol_dto_1 = require("../../dto/protocol.dto");
const create_protocol_service_1 = require("../../services/protocol/create-protocol/create-protocol.service");
const delete_protocol_service_1 = require("../../services/protocol/delete-protocol/delete-protocol.service");
const find_protocol_service_1 = require("../../services/protocol/find-protocol/find-protocol.service");
const update_protocol_service_1 = require("../../services/protocol/update-protocol/update-protocol.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const update_risk_protocol_service_1 = require("../../services/protocol/update-risk-protocol/update-risk-protocol.service");
let ProtocolController = class ProtocolController {
    constructor(updateProtocolsService, createProtocolsService, findAvailableProtocolsService, deleteSoftExamService, updateRiskProtocolsService) {
        this.updateProtocolsService = updateProtocolsService;
        this.createProtocolsService = createProtocolsService;
        this.findAvailableProtocolsService = findAvailableProtocolsService;
        this.deleteSoftExamService = deleteSoftExamService;
        this.updateRiskProtocolsService = updateRiskProtocolsService;
    }
    find(userPayloadDto, query) {
        return this.findAvailableProtocolsService.execute(query, userPayloadDto);
    }
    create(upsertAccessGroupDto, userPayloadDto) {
        return this.createProtocolsService.execute(upsertAccessGroupDto, userPayloadDto);
    }
    update(upsertAccessGroupDto, userPayloadDto, id) {
        return this.updateProtocolsService.execute(Object.assign(Object.assign({}, upsertAccessGroupDto), { id }), userPayloadDto);
    }
    deleteSoft(userPayloadDto, id) {
        return this.deleteSoftExamService.execute(id, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, protocol_dto_1.FindProtocolDto]),
    __metadata("design:returntype", void 0)
], ProtocolController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/protocol.entity").ProtocolEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [protocol_dto_1.CreateProtocolDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], ProtocolController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/protocol.entity").ProtocolEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [protocol_dto_1.UpdateProtocolDto, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], ProtocolController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:id/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/protocol.entity").ProtocolEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], ProtocolController.prototype, "deleteSoft", null);
ProtocolController = __decorate([
    (0, swagger_1.ApiTags)('protocol'),
    (0, common_1.Controller)('protocol'),
    __metadata("design:paramtypes", [update_protocol_service_1.UpdateProtocolsService,
        create_protocol_service_1.CreateProtocolsService,
        find_protocol_service_1.FindProtocolsService,
        delete_protocol_service_1.DeleteSoftProtocolsService,
        update_risk_protocol_service_1.UpdateRiskProtocolsService])
], ProtocolController);
exports.ProtocolController = ProtocolController;
//# sourceMappingURL=protocol.controller.js.map