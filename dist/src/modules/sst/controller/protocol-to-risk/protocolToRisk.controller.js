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
exports.ProtocolToRiskController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const protocol_to_risk_dto_1 = require("../../dto/protocol-to-risk.dto");
const copy_protocol_service_1 = require("../../services/protocolToRisk/copy-protocol/copy-protocol.service");
const create_protocol_service_1 = require("../../services/protocolToRisk/create-protocol/create-protocol.service");
const find_protocol_service_1 = require("../../services/protocolToRisk/find-protocol/find-protocol.service");
const update_protocol_service_1 = require("../../services/protocolToRisk/update-protocol/update-protocol.service");
let ProtocolToRiskController = class ProtocolToRiskController {
    constructor(createProtocolToService, findProtocolToService, updateProtocolToService, copyProtocolToRiskService) {
        this.createProtocolToService = createProtocolToService;
        this.findProtocolToService = findProtocolToService;
        this.updateProtocolToService = updateProtocolToService;
        this.copyProtocolToRiskService = copyProtocolToRiskService;
    }
    create(userPayloadDto, createProtocolToDto) {
        return this.createProtocolToService.execute(createProtocolToDto, userPayloadDto);
    }
    copy(userPayloadDto, createProtocolToDto) {
        return this.copyProtocolToRiskService.execute(createProtocolToDto, userPayloadDto);
    }
    async update(id, userPayloadDto, updateRiskDto) {
        return this.updateProtocolToService.execute(id, updateRiskDto, userPayloadDto);
    }
    findAllAvailable(userPayloadDto, query) {
        return this.findProtocolToService.execute(query, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/protocol.entity").ProtocolToRiskEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, protocol_to_risk_dto_1.CreateProtocolToRiskDto]),
    __metadata("design:returntype", void 0)
], ProtocolToRiskController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Post)('copy'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, protocol_to_risk_dto_1.CopyProtocolToRiskDto]),
    __metadata("design:returntype", void 0)
], ProtocolToRiskController.prototype, "copy", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Patch)('/:id/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/protocol.entity").ProtocolToRiskEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_payload_dto_1.UserPayloadDto, protocol_to_risk_dto_1.UpdateProtocolToRiskDto]),
    __metadata("design:returntype", Promise)
], ProtocolToRiskController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROTOCOL,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, protocol_to_risk_dto_1.FindProtocolToRiskDto]),
    __metadata("design:returntype", void 0)
], ProtocolToRiskController.prototype, "findAllAvailable", null);
ProtocolToRiskController = __decorate([
    (0, common_1.Controller)('protocol/risk'),
    __metadata("design:paramtypes", [create_protocol_service_1.CreateProtocolToRiskService,
        find_protocol_service_1.FindProtocolToRiskService,
        update_protocol_service_1.UpdateProtocolToRiskService,
        copy_protocol_service_1.CopyProtocolToRiskService])
], ProtocolToRiskController);
exports.ProtocolToRiskController = ProtocolToRiskController;
//# sourceMappingURL=protocolToRisk.controller.js.map