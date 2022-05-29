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
exports.LicenseEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class LicenseEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, companies: { required: false, type: () => [require("./company.entity").CompanyEntity] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the License' }),
    __metadata("design:type", Number)
], LicenseEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the License' }),
    __metadata("design:type", String)
], LicenseEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the License',
        examples: ['ACTIVE', 'PENDING', 'CANCELED'],
    }),
    __metadata("design:type", String)
], LicenseEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the License' }),
    __metadata("design:type", Date)
], LicenseEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The companies related to the License' }),
    __metadata("design:type", Array)
], LicenseEntity.prototype, "companies", void 0);
exports.LicenseEntity = LicenseEntity;
//# sourceMappingURL=license.entity.js.map