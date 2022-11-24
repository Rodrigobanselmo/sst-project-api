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
exports.UserCompanyEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UserCompanyEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, roles: { required: true, type: () => [String] }, permissions: { required: true, type: () => [String] }, updated_at: { required: true, type: () => Date }, created_at: { required: true, type: () => Date }, status: { required: true, type: () => Object }, groupId: { required: true, type: () => Number }, group: { required: false, type: () => require("../../auth/entities/access-groups.entity").AccessGroupsEntity } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the User' }),
    __metadata("design:type", Number)
], UserCompanyEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the company' }),
    __metadata("design:type", String)
], UserCompanyEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['admin'], description: 'The roles of the User' }),
    __metadata("design:type", Array)
], UserCompanyEntity.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['user.create'],
        description: 'The permissions of the User',
    }),
    __metadata("design:type", Array)
], UserCompanyEntity.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The last time that the User was updated' }),
    __metadata("design:type", Date)
], UserCompanyEntity.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the User account' }),
    __metadata("design:type", Date)
], UserCompanyEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the user account',
        examples: ['ACTIVE', 'PENDING', 'CANCELED'],
    }),
    __metadata("design:type", String)
], UserCompanyEntity.prototype, "status", void 0);
exports.UserCompanyEntity = UserCompanyEntity;
//# sourceMappingURL=userCompany.entity.js.map