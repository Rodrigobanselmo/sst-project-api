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
exports.CompanyReportEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class CompanyReportEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, lastDailyReport: { required: true, type: () => Date }, dailyReport: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, esocialPendent: { required: true, type: () => Number }, esocialReject: { required: true, type: () => Number }, esocialDone: { required: true, type: () => Number }, esocialProgress: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the company report' }),
    __metadata("design:type", Number)
], CompanyReportEntity.prototype, "id", void 0);
exports.CompanyReportEntity = CompanyReportEntity;
//# sourceMappingURL=report.entity.js.map