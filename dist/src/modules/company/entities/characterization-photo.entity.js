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
exports.CharacterizationPhotoEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class CharacterizationPhotoEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, photoUrl: { required: true, type: () => String, nullable: true }, created_at: { required: true, type: () => Date }, isVertical: { required: true, type: () => Boolean }, order: { required: true, type: () => Number }, deleted_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, companyCharacterizationId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the company environment photo' }),
    __metadata("design:type", String)
], CharacterizationPhotoEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the company environment photo' }),
    __metadata("design:type", String)
], CharacterizationPhotoEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The url of the company environment photo',
    }),
    __metadata("design:type", String)
], CharacterizationPhotoEntity.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The creation date of the company environment photo',
    }),
    __metadata("design:type", Date)
], CharacterizationPhotoEntity.prototype, "created_at", void 0);
exports.CharacterizationPhotoEntity = CharacterizationPhotoEntity;
//# sourceMappingURL=characterization-photo.entity.js.map