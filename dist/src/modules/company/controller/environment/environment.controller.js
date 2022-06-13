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
exports.EnvironmentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const png_filters_1 = require("../../../../shared/utils/filters/png.filters");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const environment_dto_1 = require("../../dto/environment.dto");
const delete_environment_service_1 = require("../../services/environment/delete-environment/delete-environment.service");
const find_all_environment_service_1 = require("../../services/environment/find-all-environment/find-all-environment.service");
const upsert_environment_service_1 = require("../../services/environment/upsert-environment/upsert-environment.service");
let EnvironmentController = class EnvironmentController {
    constructor(upsertEnvironmentService, findAllEnvironmentService, deleteEnvironmentService) {
        this.upsertEnvironmentService = upsertEnvironmentService;
        this.findAllEnvironmentService = findAllEnvironmentService;
        this.deleteEnvironmentService = deleteEnvironmentService;
    }
    findAll(userPayloadDto, workspaceId) {
        return this.findAllEnvironmentService.execute(workspaceId, userPayloadDto);
    }
    upsert(upsertEnvironmentDto, userPayloadDto, workspaceId, files) {
        return this.upsertEnvironmentService.execute(upsertEnvironmentDto, workspaceId, userPayloadDto, files);
    }
    async uploadRiskFile(file, upsertPhotoEnvironmentDto, userPayloadDto, workspaceId) {
        return upsertPhotoEnvironmentDto;
    }
    deletePhoto(id, workspaceId, userPayloadDto) {
        return this.deleteEnvironmentService.execute(id, workspaceId, userPayloadDto);
    }
    delete(id, workspaceId, userPayloadDto) {
        return this.deleteEnvironmentService.execute(id, workspaceId, userPayloadDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/environment.entity").EnvironmentEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String]),
    __metadata("design:returntype", void 0)
], EnvironmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 5, { fileFilter: png_filters_1.pngFileFilter })),
    openapi.ApiResponse({ status: 201, type: require("../../entities/environment.entity").EnvironmentEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('workspaceId')),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [environment_dto_1.UpsertEnvironmentDto,
        user_payload_dto_1.UserPayloadDto, String, Array]),
    __metadata("design:returntype", void 0)
], EnvironmentController.prototype, "upsert", null);
__decorate([
    (0, common_1.Post)('/photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201, type: require("../../dto/environment.dto").UpsertPhotoEnvironmentDto }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __param(3, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, environment_dto_1.UpsertPhotoEnvironmentDto,
        user_payload_dto_1.UserPayloadDto, String]),
    __metadata("design:returntype", Promise)
], EnvironmentController.prototype, "uploadRiskFile", null);
__decorate([
    (0, common_1.Delete)('/photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 200, type: require("../../entities/environment.entity").EnvironmentEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EnvironmentController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/environment.entity").EnvironmentEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EnvironmentController.prototype, "delete", null);
EnvironmentController = __decorate([
    (0, swagger_1.ApiTags)('environments'),
    (0, common_1.Controller)('/company/:companyId/workspace/:workspaceId/environments'),
    __metadata("design:paramtypes", [upsert_environment_service_1.UpsertEnvironmentService,
        find_all_environment_service_1.FindAllEnvironmentService,
        delete_environment_service_1.DeleteEnvironmentService])
], EnvironmentController);
exports.EnvironmentController = EnvironmentController;
//# sourceMappingURL=environment.controller.js.map