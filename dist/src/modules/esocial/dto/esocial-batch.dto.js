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
exports.FindESocialBatchDto = exports.CreateESocialBatch = exports.CreateESocialEvent = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const query_array_1 = require("./../../../shared/transformers/query-array");
class CreateESocialEvent {
    static _OPENAPI_METADATA_FACTORY() {
        return { eventsDate: { required: false, type: () => Date }, eventXml: { required: true, type: () => String }, employeeId: { required: true, type: () => Number }, eventId: { required: true, type: () => String }, examHistoryId: { required: false, type: () => Number }, pppHistoryId: { required: false, type: () => Number }, action: { required: false, type: () => Object } };
    }
}
exports.CreateESocialEvent = CreateESocialEvent;
class CreateESocialBatch {
    static _OPENAPI_METADATA_FACTORY() {
        return { environment: { required: true, type: () => Number }, status: { required: true, type: () => Object }, userTransmissionId: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, response: { required: false, type: () => Object }, events: { required: false, type: () => [require("./esocial-batch.dto").CreateESocialEvent] }, examsIds: { required: false, type: () => [Number] }, pppJson: { required: false }, type: { required: true, type: () => Object }, protocolId: { required: false, type: () => String } };
    }
}
exports.CreateESocialBatch = CreateESocialBatch;
class FindESocialBatchDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: true, type: () => String }, companyId: { required: true, type: () => String }, status: { required: false, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindESocialBatchDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindESocialBatchDto.prototype, "companyId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        each: true,
        message: `Erro ao enviar status`,
    }),
    __metadata("design:type", Array)
], FindESocialBatchDto.prototype, "status", void 0);
exports.FindESocialBatchDto = FindESocialBatchDto;
//# sourceMappingURL=esocial-batch.dto.js.map