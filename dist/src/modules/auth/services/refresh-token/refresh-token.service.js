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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
;
const UsersRepository_1 = require("../../../../modules/users/repositories/implementations/UsersRepository");
const JwtTokenProvider_1 = require("../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider");
const RefreshTokensRepository_1 = require("../../repositories/implementations/RefreshTokensRepository");
let RefreshTokenService = class RefreshTokenService {
    constructor(usersRepository, refreshTokensRepository, jwtTokenProvider) {
        this.usersRepository = usersRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    async execute(refresh_token) {
        const sub = this.jwtTokenProvider.verifyIsValidToken(refresh_token, 'refresh');
        if (sub === 'expired') {
            await this.refreshTokensRepository.deleteByRefreshToken(refresh_token);
            throw new common_1.UnauthorizedException('jwt expired');
        }
        if (sub === 'invalid') {
            throw new common_1.UnauthorizedException('invalid jwt');
        }
        const userId = Number(sub);
        const userRefreshToken = await this.refreshTokensRepository.findByUserIdAndRefreshToken(userId, refresh_token);
        if (!userRefreshToken) {
            throw new common_1.UnauthorizedException('Refresh Token does not exists!');
        }
        const user = await this.usersRepository.findById(userId);
        const companies = user.companies
            .map(({ companyId, permissions, roles, status }) => {
            if (status.toUpperCase() !== 'ACTIVE')
                return null;
            return {
                companyId,
                permissions,
                roles,
            };
        })
            .filter((i) => i);
        const company = companies[0] || {};
        const payloadToken = Object.assign({ email: user.email, sub: user.id }, company);
        const token = this.jwtTokenProvider.generateToken(payloadToken);
        const [new_refresh_token, refreshTokenExpiresDate] = this.jwtTokenProvider.generateRefreshToken(user.id);
        const refreshToken = await this.refreshTokensRepository.create(new_refresh_token, user.id, refreshTokenExpiresDate);
        await this.refreshTokensRepository.deleteById(userRefreshToken.id);
        return Object.assign({ refresh_token: refreshToken.refresh_token, token: token, user: (0, class_transformer_1.classToClass)(user) }, company);
    }
};
RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository,
        RefreshTokensRepository_1.RefreshTokensRepository,
        JwtTokenProvider_1.JwtTokenProvider])
], RefreshTokenService);
exports.RefreshTokenService = RefreshTokenService;
//# sourceMappingURL=refresh-token.service.js.map