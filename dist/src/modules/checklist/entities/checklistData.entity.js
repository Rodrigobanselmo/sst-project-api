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
exports.ChecklistDataEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require(".prisma/client");
class ChecklistDataEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { checklistId: { required: true, type: () => Number }, json: { required: true, type: () => Object }, companyId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the recommendation or control measure',
    }),
    __metadata("design:type", Number)
], ChecklistDataEntity.prototype, "checklistId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the checklist json data' }),
    __metadata("design:type", Object)
], ChecklistDataEntity.prototype, "json", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the company id related' }),
    __metadata("design:type", String)
], ChecklistDataEntity.prototype, "companyId", void 0);
exports.ChecklistDataEntity = ChecklistDataEntity;
//# sourceMappingURL=checklistData.entity.js.map