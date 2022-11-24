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
exports.DatabaseTableEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class DatabaseTableEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, version: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, system: { required: true, type: () => Boolean }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, company: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the database table' }),
    __metadata("design:type", Number)
], DatabaseTableEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the database table' }),
    __metadata("design:type", String)
], DatabaseTableEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The actual version of the database table' }),
    __metadata("design:type", Number)
], DatabaseTableEntity.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company owner of the database table' }),
    __metadata("design:type", String)
], DatabaseTableEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'If the data was created from one of simple professionals',
    }),
    __metadata("design:type", Boolean)
], DatabaseTableEntity.prototype, "system", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The actual status of the database table' }),
    __metadata("design:type", String)
], DatabaseTableEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the data' }),
    __metadata("design:type", Date)
], DatabaseTableEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The last update of the table date' }),
    __metadata("design:type", Date)
], DatabaseTableEntity.prototype, "updated_at", void 0);
exports.DatabaseTableEntity = DatabaseTableEntity;
//# sourceMappingURL=databaseTable.entity.js.map