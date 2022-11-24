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
exports.RefreshTokenEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class RefreshTokenEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, refresh_token: { required: true, type: () => String }, userId: { required: true, type: () => Number }, expires_date: { required: true, type: () => Date }, created_at: { required: true, type: () => Date } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the RefreshToken' }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The token value' }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The user id that this token refers to' }),
    __metadata("design:type", Number)
], RefreshTokenEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The Refresh Token expiration date' }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "expires_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The Refresh Token creation date' }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "created_at", void 0);
exports.RefreshTokenEntity = RefreshTokenEntity;
//# sourceMappingURL=refresh-tokens.entity.js.map