"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEmailPipe = void 0;
const common_1 = require("@nestjs/common");
let ValidateEmailPipe = class ValidateEmailPipe {
    transform(value) {
        if (!value)
            throw new common_1.BadRequestException(`Email is required`);
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
            return value;
        throw new common_1.BadRequestException(`Validation failed. "${value}" is not an valid email.`);
    }
};
ValidateEmailPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateEmailPipe);
exports.ValidateEmailPipe = ValidateEmailPipe;
//# sourceMappingURL=validate-email.pipe.js.map