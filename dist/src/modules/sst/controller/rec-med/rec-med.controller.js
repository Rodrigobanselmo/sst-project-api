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
exports.RecMedController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const rec_med_dto_1 = require("../../dto/rec-med.dto");
const create_rec_med_service_1 = require("../../services/rec-med/create-rec-med/create-rec-med.service");
const delete_soft_rec_med_service_1 = require("../../services/rec-med/delete-soft-rec-med/delete-soft-rec-med.service");
const update_rec_med_service_1 = require("../../services/rec-med/update-rec-med/update-rec-med.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
let RecMedController = class RecMedController {
    constructor(createRecMedService, updateRecMedService, deleteSoftRecMedService) {
        this.createRecMedService = createRecMedService;
        this.updateRecMedService = updateRecMedService;
        this.deleteSoftRecMedService = deleteSoftRecMedService;
    }
    create(userPayloadDto, createRecMedDto) {
        return this.createRecMedService.execute(createRecMedDto, userPayloadDto);
    }
    async update(recMedId, userPayloadDto, updateRiskDto) {
        return this.updateRecMedService.execute(recMedId, updateRiskDto, userPayloadDto);
    }
    async deleteSoft(recMedId, userPayloadDto) {
        return this.deleteSoftRecMedService.execute(recMedId, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.REC_MED,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/recMed.entity").RecMedEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, rec_med_dto_1.CreateRecMedDto]),
    __metadata("design:returntype", void 0)
], RecMedController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.REC_MED,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Patch)('/:recMedId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/recMed.entity").RecMedEntity }),
    __param(0, (0, common_1.Param)('recMedId')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto, rec_med_dto_1.UpdateRecMedDto]),
    __metadata("design:returntype", Promise)
], RecMedController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.REC_MED,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Delete)('/:recMedId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/recMed.entity").RecMedEntity }),
    __param(0, (0, common_1.Param)('recMedId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], RecMedController.prototype, "deleteSoft", null);
RecMedController = __decorate([
    (0, common_1.Controller)('rec-med'),
    __metadata("design:paramtypes", [create_rec_med_service_1.CreateRecMedService,
        update_rec_med_service_1.UpdateRecMedService,
        delete_soft_rec_med_service_1.DeleteSoftRecMedService])
], RecMedController);
exports.RecMedController = RecMedController;
//# sourceMappingURL=rec-med.controller.js.map