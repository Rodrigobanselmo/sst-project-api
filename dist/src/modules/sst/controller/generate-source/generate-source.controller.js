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
exports.GenerateSourceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const generate_source_dto_1 = require("../../dto/generate-source.dto");
const create_generate_source_service_1 = require("../../services/generate-source/create-generate-source/create-generate-source.service");
const delete_soft_generate_source_service_1 = require("../../services/generate-source/delete-soft-generate-source/delete-soft-generate-source.service");
const update_generate_source_service_1 = require("../../services/generate-source/update-generate-source/update-generate-source.service");
let GenerateSourceController = class GenerateSourceController {
    constructor(createGenerateSourceService, updateGenerateSourceService, deleteSoftGenerateSourceService) {
        this.createGenerateSourceService = createGenerateSourceService;
        this.updateGenerateSourceService = updateGenerateSourceService;
        this.deleteSoftGenerateSourceService = deleteSoftGenerateSourceService;
    }
    create(userPayloadDto, createGenerateSourceDto) {
        return this.createGenerateSourceService.execute(createGenerateSourceDto, userPayloadDto);
    }
    async update(generateSourceId, userPayloadDto, updateRiskDto) {
        return this.updateGenerateSourceService.execute(generateSourceId, updateRiskDto, userPayloadDto);
    }
    async deleteSoft(generateSourceId, userPayloadDto) {
        return this.deleteSoftGenerateSourceService.execute(generateSourceId, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.GS,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/generateSource.entity").GenerateSourceEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, generate_source_dto_1.CreateGenerateSourceDto]),
    __metadata("design:returntype", void 0)
], GenerateSourceController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.GS,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Patch)('/:generateSourceId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/generateSource.entity").GenerateSourceEntity }),
    __param(0, (0, common_1.Param)('generateSourceId')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto, generate_source_dto_1.UpdateGenerateSourceDto]),
    __metadata("design:returntype", Promise)
], GenerateSourceController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.GS,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Delete)('/:generateSourceId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/generateSource.entity").GenerateSourceEntity }),
    __param(0, (0, common_1.Param)('generateSourceId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], GenerateSourceController.prototype, "deleteSoft", null);
GenerateSourceController = __decorate([
    (0, common_1.Controller)('generate-source'),
    __metadata("design:paramtypes", [create_generate_source_service_1.CreateGenerateSourceService,
        update_generate_source_service_1.UpdateGenerateSourceService,
        delete_soft_generate_source_service_1.DeleteSoftGenerateSourceService])
], GenerateSourceController);
exports.GenerateSourceController = GenerateSourceController;
//# sourceMappingURL=generate-source.controller.js.map