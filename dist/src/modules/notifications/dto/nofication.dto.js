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
exports.FindNotificationDto = exports.UpdateUserNotificationDto = exports.UpdateNotificationDto = exports.CreateNotificationDto = exports.MessageNotificationDto = void 0;
const openapi = require("@nestjs/swagger");
const message_enum_1 = require("./../../../shared/constants/enum/message.enum");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const keysOfEnum_utils_1 = require("./../../../shared/utils/keysOfEnum.utils");
const query_array_1 = require("./../../../shared/transformers/query-array");
class MessageNotificationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: false, type: () => String }, title: { required: false, type: () => String }, subtitle: { required: false, type: () => String }, type: { required: false, enum: require("../../../shared/constants/enum/message.enum").MessageEnum } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MessageNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MessageNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MessageNotificationDto.prototype, "subtitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(message_enum_1.MessageEnum, {
        message: `tipos disponíveis: ${(0, keysOfEnum_utils_1.KeysOfEnum)(message_enum_1.MessageEnum)}`,
    }),
    __metadata("design:type", String)
], MessageNotificationDto.prototype, "type", void 0);
exports.MessageNotificationDto = MessageNotificationDto;
class CreateNotificationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { companiesIds: { required: false, type: () => [String] }, usersIds: { required: false, type: () => [Number] }, isClinic: { required: false, type: () => Boolean }, isConsulting: { required: false, type: () => Boolean }, isCompany: { required: false, type: () => Boolean }, repeatId: { required: false, type: () => String }, json: { required: true, type: () => require("./nofication.dto").MessageNotificationDto } };
    }
}
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "companiesIds", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "usersIds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "isClinic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "isConsulting", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "isCompany", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "repeatId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", MessageNotificationDto)
], CreateNotificationDto.prototype, "json", void 0);
exports.CreateNotificationDto = CreateNotificationDto;
class UpdateNotificationDto extends (0, swagger_1.PartialType)(CreateNotificationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, json: { required: false, type: () => require("./nofication.dto").MessageNotificationDto } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateNotificationDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", MessageNotificationDto)
], UpdateNotificationDto.prototype, "json", void 0);
exports.UpdateNotificationDto = UpdateNotificationDto;
class UpdateUserNotificationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, ids: { required: true, type: () => [Number] }, userId: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateUserNotificationDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateUserNotificationDto.prototype, "ids", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateUserNotificationDto.prototype, "userId", void 0);
exports.UpdateUserNotificationDto = UpdateUserNotificationDto;
class FindNotificationDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { companiesIds: { required: false, type: () => [String] }, usersIds: { required: false, type: () => [Number] }, isClinic: { required: false, type: () => Boolean }, isConsulting: { required: false, type: () => Boolean }, isCompany: { required: false, type: () => Boolean }, isUnread: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindNotificationDto.prototype, "companiesIds", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindNotificationDto.prototype, "usersIds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindNotificationDto.prototype, "isClinic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindNotificationDto.prototype, "isConsulting", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindNotificationDto.prototype, "isCompany", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindNotificationDto.prototype, "isUnread", void 0);
exports.FindNotificationDto = FindNotificationDto;
//# sourceMappingURL=nofication.dto.js.map