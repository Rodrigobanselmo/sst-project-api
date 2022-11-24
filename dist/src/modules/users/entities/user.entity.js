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
exports.UserEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const professional_entity_1 = require("./professional.entity");
class UserEntity {
    constructor(partial) {
        var _a, _b, _c, _d, _e, _f;
        Object.assign(this, partial);
        if (partial === null || partial === void 0 ? void 0 : partial.professional) {
            this.professional = new professional_entity_1.ProfessionalEntity(Object.assign({}, partial.professional));
            if ((_a = this.professional) === null || _a === void 0 ? void 0 : _a.councilId)
                this.councilId = this.professional.councilId;
            if ((_b = this.professional) === null || _b === void 0 ? void 0 : _b.councilUF)
                this.councilUF = this.professional.councilUF;
            if ((_c = this.professional) === null || _c === void 0 ? void 0 : _c.councilType)
                this.councilType = this.professional.councilType;
            if ((_d = this.professional) === null || _d === void 0 ? void 0 : _d.councils)
                this.councils = this.professional.councils;
            if ((_e = this.professional) === null || _e === void 0 ? void 0 : _e.formation)
                this.formation = this.professional.formation;
            if (!((_f = this.professional) === null || _f === void 0 ? void 0 : _f.certifications))
                this.certifications = this.professional.certifications;
            if (!(this === null || this === void 0 ? void 0 : this.type))
                this.type = this.professional.type;
            if (!(this === null || this === void 0 ? void 0 : this.cpf))
                this.cpf = this.professional.cpf;
            if (!(this === null || this === void 0 ? void 0 : this.phone))
                this.phone = this.professional.phone;
            if (!(this === null || this === void 0 ? void 0 : this.name))
                this.name = this.professional.name;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, email: { required: true, type: () => String }, name: { required: true, type: () => String }, password: { required: true, type: () => String }, updated_at: { required: true, type: () => Date }, created_at: { required: true, type: () => Date }, deleted_at: { required: true, type: () => Date, nullable: true }, companies: { required: false, type: () => [require("./userCompany.entity").UserCompanyEntity] }, formation: { required: true, type: () => [String] }, certifications: { required: true, type: () => [String] }, cpf: { required: true, type: () => String }, phone: { required: true, type: () => String }, googleExternalId: { required: true, type: () => String }, facebookExternalId: { required: true, type: () => String }, councilType: { required: true, type: () => String }, councilUF: { required: true, type: () => String }, councilId: { required: true, type: () => String }, type: { required: true, type: () => Object }, professional: { required: false, type: () => require("./professional.entity").ProfessionalEntity }, userPgrSignature: { required: false, type: () => require("../../sst/entities/usersRiskGroup").UsersRiskGroupEntity }, usersPgrSignatures: { required: false, type: () => [require("../../sst/entities/usersRiskGroup").UsersRiskGroupEntity] }, councils: { required: false, type: () => [require("./council.entity").ProfessionalCouncilEntity] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the User' }),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The email of the User' }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the User' }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The password of the User' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The last time that the User was updated' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the User account' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The deleted date of data' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], UserEntity.prototype, "companies", void 0);
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map