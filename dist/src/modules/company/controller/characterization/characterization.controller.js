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
exports.CharacterizationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const png_filters_1 = require("../../../../shared/utils/filters/png.filters");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const characterization_dto_1 = require("../../dto/characterization.dto");
const delete_characterization_service_1 = require("../../services/characterization/delete-characterization/delete-characterization.service");
const find_all_characterization_service_1 = require("../../services/characterization/find-all-characterization/find-all-characterization.service");
const upsert_characterization_service_1 = require("../../services/characterization/upsert-characterization/upsert-characterization.service");
const add_characterization_photo_service_1 = require("../../services/characterization/add-characterization-photo/add-characterization-photo.service");
const delete_characterization_photo_service_1 = require("../../services/characterization/delete-characterization-photo/delete-characterization-photo.service");
const find_by_id_characterization_service_1 = require("../../services/characterization/find-by-id-characterization/find-by-id-characterization.service");
const update_characterization_photo_service_1 = require("../../services/characterization/update-characterization-photo/update-characterization-photo.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const copy_characterization_service_1 = require("../../services/characterization/copy-characterization/copy-characterization.service");
let CharacterizationController = class CharacterizationController {
    constructor(upsertCharacterizationService, findAllCharacterizationService, deleteCharacterizationService, addCharacterizationPhotoService, deleteCharacterizationPhotoService, findByIdCharacterizationService, updateCharacterizationPhotoService, copyCharacterizationService) {
        this.upsertCharacterizationService = upsertCharacterizationService;
        this.findAllCharacterizationService = findAllCharacterizationService;
        this.deleteCharacterizationService = deleteCharacterizationService;
        this.addCharacterizationPhotoService = addCharacterizationPhotoService;
        this.deleteCharacterizationPhotoService = deleteCharacterizationPhotoService;
        this.findByIdCharacterizationService = findByIdCharacterizationService;
        this.updateCharacterizationPhotoService = updateCharacterizationPhotoService;
        this.copyCharacterizationService = copyCharacterizationService;
    }
    findAll(userPayloadDto, workspaceId) {
        return this.findAllCharacterizationService.execute(workspaceId, userPayloadDto);
    }
    findById(userPayloadDto, id) {
        return this.findByIdCharacterizationService.execute(id, userPayloadDto);
    }
    upsert(body, userPayloadDto, workspaceId, files) {
        if (!('considerations' in body))
            body.considerations = [];
        if (!('activities' in body))
            body.activities = [];
        if (!('paragraphs' in body))
            body.paragraphs = [];
        if (!('photos' in body))
            body.photos = [];
        return this.upsertCharacterizationService.execute(body, workspaceId, userPayloadDto, files);
    }
    async uploadRiskFile(file, addPhotoCharacterizationDto, userPayloadDto) {
        return this.addCharacterizationPhotoService.execute(addPhotoCharacterizationDto, userPayloadDto, file);
    }
    async update(updatePhotoCharacterizationDto, id) {
        return this.updateCharacterizationPhotoService.execute(id, updatePhotoCharacterizationDto);
    }
    deletePhoto(id) {
        return this.deleteCharacterizationPhotoService.execute(id);
    }
    delete(id, workspaceId, userPayloadDto) {
        return this.deleteCharacterizationService.execute(id, workspaceId, userPayloadDto);
    }
    async copy(copyCharacterizationDto, workspaceId, userPayloadDto) {
        return this.copyCharacterizationService.execute(Object.assign(Object.assign({}, copyCharacterizationDto), { workspaceId }), userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/characterization.entity").CharacterizationEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String]),
    __metadata("design:returntype", void 0)
], CharacterizationController.prototype, "findAll", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/characterization.entity").CharacterizationEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String]),
    __metadata("design:returntype", void 0)
], CharacterizationController.prototype, "findById", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
        crud: 'cu',
    }),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 5, { fileFilter: png_filters_1.pngFileFilter })),
    openapi.ApiResponse({ status: 201, type: require("../../entities/characterization.entity").CharacterizationEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('workspaceId')),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characterization_dto_1.UpsertCharacterizationDto,
        user_payload_dto_1.UserPayloadDto, String, Array]),
    __metadata("design:returntype", void 0)
], CharacterizationController.prototype, "upsert", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
        crud: 'cu',
    }),
    (0, common_1.Post)('/photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201, type: require("../../entities/characterization.entity").CharacterizationEntity }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, characterization_dto_1.AddPhotoCharacterizationDto,
        user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], CharacterizationController.prototype, "uploadRiskFile", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
        crud: 'cu',
    }),
    (0, common_1.Post)('/photo/:id'),
    openapi.ApiResponse({ status: 201, type: require("../../entities/characterization.entity").CharacterizationEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characterization_dto_1.UpdatePhotoCharacterizationDto, String]),
    __metadata("design:returntype", Promise)
], CharacterizationController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
        crud: 'cu',
    }),
    (0, common_1.Delete)('/photo/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 200, type: require("../../entities/characterization.entity").CharacterizationEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CharacterizationController.prototype, "deletePhoto", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/characterization.entity").CharacterizationEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CharacterizationController.prototype, "delete", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CHARACTERIZATION,
        isContract: true,
        isMember: true,
        crud: 'cu',
    }),
    (0, common_1.Post)('/copy'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characterization_dto_1.CopyCharacterizationDto, String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], CharacterizationController.prototype, "copy", null);
CharacterizationController = __decorate([
    (0, swagger_1.ApiTags)('characterizations'),
    (0, common_1.Controller)('/company/:companyId/workspace/:workspaceId/characterizations'),
    __metadata("design:paramtypes", [upsert_characterization_service_1.UpsertCharacterizationService,
        find_all_characterization_service_1.FindAllCharacterizationService,
        delete_characterization_service_1.DeleteCharacterizationService,
        add_characterization_photo_service_1.AddCharacterizationPhotoService,
        delete_characterization_photo_service_1.DeleteCharacterizationPhotoService,
        find_by_id_characterization_service_1.FindByIdCharacterizationService,
        update_characterization_photo_service_1.UpdateCharacterizationPhotoService,
        copy_characterization_service_1.CopyCharacterizationService])
], CharacterizationController);
exports.CharacterizationController = CharacterizationController;
//# sourceMappingURL=characterization.controller.js.map