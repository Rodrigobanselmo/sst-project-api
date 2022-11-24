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
exports.FindEvents2240Dto = exports.FindEvents2220Dto = exports.Event2240Dto = exports.Event2220Dto = exports.BaseEventDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const event_batch_1 = require("../interfaces/event-batch");
const query_array_1 = require("./../../../shared/transformers/query-array");
const keysOfEnum_utils_1 = require("./../../../shared/utils/keysOfEnum.utils");
class BaseEventDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { tpAmb: { required: false, enum: require("../interfaces/event-batch").TpAmbEnum }, procEmi: { required: false, type: () => Number }, companyId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsEnum)(event_batch_1.TpAmbEnum, {
        message: `status must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(event_batch_1.TpAmbEnum)}`,
    }),
    __metadata("design:type", Number)
], BaseEventDto.prototype, "tpAmb", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsEnum)(event_batch_1.ProcEmiEnum, {
        message: `status must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(event_batch_1.ProcEmiEnum)}`,
    }),
    __metadata("design:type", Number)
], BaseEventDto.prototype, "procEmi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseEventDto.prototype, "companyId", void 0);
exports.BaseEventDto = BaseEventDto;
class Event2220Dto extends BaseEventDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.Event2220Dto = Event2220Dto;
class Event2240Dto extends BaseEventDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.Event2240Dto = Event2240Dto;
class FindEvents2220Dto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, companyId: { required: true, type: () => String }, all: { required: false, type: () => Boolean }, companiesIds: { required: false, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindEvents2220Dto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindEvents2220Dto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindEvents2220Dto.prototype, "all", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindEvents2220Dto.prototype, "companiesIds", void 0);
exports.FindEvents2220Dto = FindEvents2220Dto;
class FindEvents2240Dto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, companyId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindEvents2240Dto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindEvents2240Dto.prototype, "companyId", void 0);
exports.FindEvents2240Dto = FindEvents2240Dto;
//# sourceMappingURL=event.dto.js.map