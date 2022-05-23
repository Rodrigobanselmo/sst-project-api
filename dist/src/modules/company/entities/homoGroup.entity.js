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
exports.HomoGroupEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class HomoGroupEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, status: { required: true, type: () => Object }, companyId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, hierarchies: { required: false, type: () => [require("./hierarchy.entity").HierarchyEntity] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the HomogeneousGroup' }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the HomogeneousGroup' }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the HomogeneousGroup' }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the HomogeneousGroup',
        examples: [client_1.StatusEnum.ACTIVE, client_1.StatusEnum.INACTIVE],
    }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The company id of the HomogeneousGroup',
    }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the HomogeneousGroup' }),
    __metadata("design:type", Date)
], HomoGroupEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchies of the HomogeneousGroup' }),
    __metadata("design:type", Array)
], HomoGroupEntity.prototype, "hierarchies", void 0);
exports.HomoGroupEntity = HomoGroupEntity;
//# sourceMappingURL=homoGroup.entity.js.map