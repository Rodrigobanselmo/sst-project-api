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
exports.ChecklistEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require(".prisma/client");
const checklistData_entity_1 = require("./checklistData.entity");
const class_transformer_1 = require("class-transformer");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const class_validator_1 = require("class-validator");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
class ChecklistEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, companyId: { required: true, type: () => String }, system: { required: true, type: () => Boolean }, created_at: { required: true, type: () => Date }, checklistData: { required: false, type: () => require("./checklistData.entity").ChecklistDataEntity }, status: { required: true, type: () => Object } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the recommendation or control measure',
    }),
    __metadata("design:type", Number)
], ChecklistEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the recommendation description' }),
    __metadata("design:type", String)
], ChecklistEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The company id related to the recommendation or control measure',
    }),
    __metadata("design:type", String)
], ChecklistEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'If was created from one of simple professionals',
    }),
    __metadata("design:type", Boolean)
], ChecklistEntity.prototype, "system", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk' }),
    __metadata("design:type", Date)
], ChecklistEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The checklist data' }),
    __metadata("design:type", checklistData_entity_1.ChecklistDataEntity)
], ChecklistEntity.prototype, "checklistData", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], ChecklistEntity.prototype, "status", void 0);
exports.ChecklistEntity = ChecklistEntity;
//# sourceMappingURL=checklist.entity.js.map