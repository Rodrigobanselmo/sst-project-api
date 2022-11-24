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
exports.ProfessionalResponsibleController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const professional_responsible_dto_1 = require("../../dto/professional-responsible.dto");
const create_professional_responsiblea_service_1 = require("../../services/professionals-responsibles/create-professionals-responsibles/create-professional-responsiblea.service");
const delete_professionals_responsibles_service_1 = require("../../services/professionals-responsibles/delete-professionals-responsibles/delete-professionals-responsibles.service");
const find_professionals_responsibles_service_1 = require("../../services/professionals-responsibles/find-professionals-responsibles/find-professionals-responsibles.service");
const update_professionals_responsibles_service_1 = require("../../services/professionals-responsibles/update-professionals-responsibles/update-professionals-responsibles.service");
let ProfessionalResponsibleController = class ProfessionalResponsibleController {
    constructor(updateProfessionalResponsibleService, createProfessionalResponsibleService, findAvailableProfessionalResponsibleService, deleteProfessionalResponsibleService) {
        this.updateProfessionalResponsibleService = updateProfessionalResponsibleService;
        this.createProfessionalResponsibleService = createProfessionalResponsibleService;
        this.findAvailableProfessionalResponsibleService = findAvailableProfessionalResponsibleService;
        this.deleteProfessionalResponsibleService = deleteProfessionalResponsibleService;
    }
    find(userPayloadDto, query) {
        return this.findAvailableProfessionalResponsibleService.execute(query, userPayloadDto);
    }
    create(upsertAccessGroupDto, userPayloadDto) {
        return this.createProfessionalResponsibleService.execute(upsertAccessGroupDto, userPayloadDto);
    }
    update(upsertAccessGroupDto, userPayloadDto, id) {
        return this.updateProfessionalResponsibleService.execute(Object.assign(Object.assign({}, upsertAccessGroupDto), { id }), userPayloadDto);
    }
    delete(userPayloadDto, id) {
        return this.deleteProfessionalResponsibleService.execute(id, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROF_RESP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, professional_responsible_dto_1.FindProfessionalResponsibleDto]),
    __metadata("design:returntype", void 0)
], ProfessionalResponsibleController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROF_RESP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/professional-responsible.entity").ProfessionalResponsibleEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [professional_responsible_dto_1.CreateProfessionalResponsibleDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], ProfessionalResponsibleController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROF_RESP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/professional-responsible.entity").ProfessionalResponsibleEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [professional_responsible_dto_1.UpdateProfessionalResponsibleDto, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], ProfessionalResponsibleController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROF_RESP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/professional-responsible.entity").ProfessionalResponsibleEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], ProfessionalResponsibleController.prototype, "delete", null);
ProfessionalResponsibleController = __decorate([
    (0, swagger_1.ApiTags)('professionals-responsible'),
    (0, common_1.Controller)('company/:companyId/professionals-responsible'),
    __metadata("design:paramtypes", [update_professionals_responsibles_service_1.UpdateProfessionalResponsibleService,
        create_professional_responsiblea_service_1.CreateProfessionalResponsibleService,
        find_professionals_responsibles_service_1.FindProfessionalResponsibleService,
        delete_professionals_responsibles_service_1.DeleteProfessionalResponsibleService])
], ProfessionalResponsibleController);
exports.ProfessionalResponsibleController = ProfessionalResponsibleController;
//# sourceMappingURL=professionals-responsible.controller.js.map