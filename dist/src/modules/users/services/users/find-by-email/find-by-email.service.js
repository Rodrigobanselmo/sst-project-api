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
exports.FindByEmailService = void 0;
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const common_1 = require("@nestjs/common");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
let FindByEmailService = class FindByEmailService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!(user === null || user === void 0 ? void 0 : user.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorInvitesEnum.EMAIL_NOT_FOUND.replace(':v1', email));
        delete user.password;
        return user;
    }
};
FindByEmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository])
], FindByEmailService);
exports.FindByEmailService = FindByEmailService;
//# sourceMappingURL=find-by-email.service.js.map