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
exports.ProfessionalsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const professional_dto_1 = require("../../dto/professional.dto");
const create_professional_service_1 = require("../../services/professionals/create-professional/create-professional.service");
const find_all_service_1 = require("../../services/professionals/find-all/find-all.service");
const find_first_service_1 = require("../../services/professionals/find-first/find-first.service");
const update_professional_service_1 = require("../../services/professionals/update-professional/update-professional.service");
let ProfessionalsController = class ProfessionalsController {
    constructor(findAllByCompanyService, createProfessionalService, updateProfessionalService, findFirstProfessionalService) {
        this.findAllByCompanyService = findAllByCompanyService;
        this.createProfessionalService = createProfessionalService;
        this.updateProfessionalService = updateProfessionalService;
        this.findFirstProfessionalService = findFirstProfessionalService;
    }
    findAllByCompany(userPayloadDto, query) {
        return (0, class_transformer_1.classToClass)(this.findAllByCompanyService.execute(query, userPayloadDto));
    }
    findFirst(query) {
        return (0, class_transformer_1.classToClass)(this.findFirstProfessionalService.execute(query));
    }
    async create(createProfessionalDto, user) {
        return this.createProfessionalService.execute(createProfessionalDto, user);
    }
    async update(updateProfessionalDto, user, id) {
        return this.updateProfessionalService.execute(Object.assign({ id }, updateProfessionalDto), user);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROFESSIONALS,
        isMember: true,
        isContract: true,
    }, {
        code: authorization_1.PermissionEnum.USER,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/company/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, professional_dto_1.FindProfessionalsDto]),
    __metadata("design:returntype", void 0)
], ProfessionalsController.prototype, "findAllByCompany", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PROFESSIONALS,
    }, {
        code: authorization_1.PermissionEnum.USER,
    }),
    (0, common_1.Get)('/find'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/professional.entity").ProfessionalEntity }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [professional_dto_1.FindProfessionalsDto]),
    __metadata("design:returntype", void 0)
], ProfessionalsController.prototype, "findFirst", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        isMember: true,
        isContract: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.PROFESSIONALS,
        isMember: true,
        isContract: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/professional.entity").ProfessionalEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [professional_dto_1.CreateProfessionalDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        isMember: true,
        isContract: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.PROFESSIONALS,
        isMember: true,
        isContract: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/professional.entity").ProfessionalEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [professional_dto_1.UpdateProfessionalDto, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "update", null);
ProfessionalsController = __decorate([
    (0, swagger_1.ApiTags)('professionals'),
    (0, common_1.Controller)('professionals'),
    __metadata("design:paramtypes", [find_all_service_1.FindAllProfessionalsByCompanyService,
        create_professional_service_1.CreateProfessionalService,
        update_professional_service_1.UpdateProfessionalService,
        find_first_service_1.FindFirstProfessionalService])
], ProfessionalsController);
exports.ProfessionalsController = ProfessionalsController;
//# sourceMappingURL=professionals.controller.js.map