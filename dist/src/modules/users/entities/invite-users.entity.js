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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteUsersEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class InviteUsersEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, roles: { required: true, type: () => [String] }, permissions: { required: true, type: () => [String] }, expires_date: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, companyName: { required: false, type: () => String }, logo: { required: false, type: () => String }, companiesIds: { required: true, type: () => [String] }, groupId: { required: true, type: () => Number }, professional: { required: true, type: () => require("./professional.entity").ProfessionalEntity } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the invite token' }),
    __metadata("design:type", String)
], InviteUsersEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The email of the User' }),
    __metadata("design:type", String)
], InviteUsersEntity.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['admin'], description: 'The roles of the User' }),
    __metadata("design:type", Array)
], InviteUsersEntity.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['user.create'],
        description: 'The permissions of the User',
    }),
    __metadata("design:type", Array)
], InviteUsersEntity.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The expiration date of the User invite' }),
    __metadata("design:type", Date)
], InviteUsersEntity.prototype, "expires_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id for user invitation' }),
    __metadata("design:type", String)
], InviteUsersEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InviteUsersEntity.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InviteUsersEntity.prototype, "logo", void 0);
exports.InviteUsersEntity = InviteUsersEntity;
//# sourceMappingURL=invite-users.entity.js.map