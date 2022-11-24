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
exports.EmailDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const emailsTemplates_1 = require("../../../shared/constants/enum/emailsTemplates");
const keysOfEnum_utils_1 = require("./../../../shared/utils/keysOfEnum.utils");
class EmailDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { template: { required: true, type: () => String, enum: require("../../../shared/constants/enum/emailsTemplates").EmailsTemplatesEnum }, emails: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(emailsTemplates_1.EmailsTemplatesEnum, {
        message: `templates disponíveis: ${(0, keysOfEnum_utils_1.KeysOfEnum)(emailsTemplates_1.EmailsTemplatesEnum)}`,
    }),
    __metadata("design:type", String)
], EmailDto.prototype, "template", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], EmailDto.prototype, "emails", void 0);
exports.EmailDto = EmailDto;
//# sourceMappingURL=email.dto.js.map