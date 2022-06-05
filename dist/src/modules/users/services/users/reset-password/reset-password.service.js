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
exports.ResetPasswordService = void 0;
const common_1 = require("@nestjs/common");
const RefreshTokensRepository_1 = require("../../../../auth/repositories/implementations/RefreshTokensRepository");
const HashProvider_1 = require("../../../../../shared/providers/HashProvider/implementations/HashProvider");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
let ResetPasswordService = class ResetPasswordService {
    constructor(userRepository, refreshTokensRepository, hashProvider) {
        this.userRepository = userRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.hashProvider = hashProvider;
    }
    async execute({ tokenId, password }) {
        const refresh_token = await this.refreshTokensRepository.findById(tokenId);
        if (!refresh_token)
            throw new common_1.BadRequestException('Token not found');
        const passHash = await this.hashProvider.createHash(password);
        const user = await this.userRepository.update(refresh_token.userId, {
            password: passHash,
        });
        return user;
    }
};
ResetPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository,
        RefreshTokensRepository_1.RefreshTokensRepository,
        HashProvider_1.HashProvider])
], ResetPasswordService);
exports.ResetPasswordService = ResetPasswordService;
//# sourceMappingURL=reset-password.service.js.map