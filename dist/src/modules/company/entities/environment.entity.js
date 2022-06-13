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
exports.EnvironmentEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const workspace_entity_1 = require("./workspace.entity");
class EnvironmentEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, created_at: { required: true, type: () => Date }, type: { required: true, type: () => Object }, parentEnvironmentId: { required: true, type: () => String }, workspace: { required: false, type: () => require("./workspace.entity").WorkspaceEntity }, photos: { required: false, type: () => [require("./environment-photo.entity").EnvironmentPhotoEntity] }, vision: { required: true, type: () => String }, deleted_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, workspaceId: { required: true, type: () => String }, companyId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the company environment' }),
    __metadata("design:type", String)
], EnvironmentEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the company environment' }),
    __metadata("design:type", String)
], EnvironmentEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The description of the company environment' }),
    __metadata("design:type", String)
], EnvironmentEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the company environment' }),
    __metadata("design:type", Date)
], EnvironmentEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of the company environment',
        examples: [...Object.values(client_1.CompanyEnvironmentTypesEnum)],
    }),
    __metadata("design:type", String)
], EnvironmentEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The parent id of the company environment' }),
    __metadata("design:type", String)
], EnvironmentEntity.prototype, "parentEnvironmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The workspace of the company environment' }),
    __metadata("design:type", workspace_entity_1.WorkspaceEntity)
], EnvironmentEntity.prototype, "workspace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The photos related to the company environment' }),
    __metadata("design:type", Array)
], EnvironmentEntity.prototype, "photos", void 0);
exports.EnvironmentEntity = EnvironmentEntity;
//# sourceMappingURL=environment.entity.js.map