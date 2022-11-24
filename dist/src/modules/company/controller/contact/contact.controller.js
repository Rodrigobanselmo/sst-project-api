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
exports.ContactController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const contact_dto_1 = require("../../dto/contact.dto");
const create_contact_service_1 = require("../../services/contact/create-contact/create-contact.service");
const delete_contact_service_1 = require("../../services/contact/delete-contact/delete-contact.service");
const find_company_groups_group_service_1 = require("../../services/contact/find-contact/find-company-groups-group.service");
const update_contact_service_1 = require("../../services/contact/update-contact/update-contact.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
let ContactController = class ContactController {
    constructor(updateContactsService, createContactsService, findAvailableContactsService, deleteContactsService) {
        this.updateContactsService = updateContactsService;
        this.createContactsService = createContactsService;
        this.findAvailableContactsService = findAvailableContactsService;
        this.deleteContactsService = deleteContactsService;
    }
    find(userPayloadDto, query) {
        return this.findAvailableContactsService.execute(query, userPayloadDto);
    }
    create(upsertAccessGroupDto, userPayloadDto) {
        return this.createContactsService.execute(upsertAccessGroupDto, userPayloadDto);
    }
    update(upsertAccessGroupDto, userPayloadDto, id) {
        return this.updateContactsService.execute(Object.assign(Object.assign({}, upsertAccessGroupDto), { id }), userPayloadDto);
    }
    delete(userPayloadDto, id) {
        return this.deleteContactsService.execute(id, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, contact_dto_1.FindContactDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/contact.entity").ContactEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_dto_1.CreateContactDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/contact.entity").ContactEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_dto_1.UpdateContactDto, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/contact.entity").ContactEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "delete", null);
ContactController = __decorate([
    (0, swagger_1.ApiTags)('contact'),
    (0, common_1.Controller)('company/:companyId/contact'),
    __metadata("design:paramtypes", [update_contact_service_1.UpdateContactsService,
        create_contact_service_1.CreateContactsService,
        find_company_groups_group_service_1.FindContactsService,
        delete_contact_service_1.DeleteContactsService])
], ContactController);
exports.ContactController = ContactController;
//# sourceMappingURL=contact.controller.js.map