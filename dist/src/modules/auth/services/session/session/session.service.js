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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const UsersRepository_1 = require("../../../../users/repositories/implementations/UsersRepository");
const HashProvider_1 = require("../../../../../shared/providers/HashProvider/implementations/HashProvider");
const JwtTokenProvider_1 = require("../../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider");
const RefreshTokensRepository_1 = require("../../../repositories/implementations/RefreshTokensRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let SessionService = class SessionService {
    constructor(usersRepository, refreshTokensRepository, hashProvider, jwtTokenProvider) {
        this.usersRepository = usersRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.hashProvider = hashProvider;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    async execute({ email, password, userEntity }) {
        const user = userEntity ? userEntity : await this.validateUser(email, password);
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
        const payload = Object.assign({ email, sub: user.id }, company);
        const token = this.jwtTokenProvider.generateToken(payload);
        const [refresh_token, refreshTokenExpiresDate] = this.jwtTokenProvider.generateRefreshToken(user.id);
        const newRefreshToken = await this.refreshTokensRepository.create(refresh_token, user.id, refreshTokenExpiresDate);
        return Object.assign({ token, refresh_token: newRefreshToken.refresh_token, user: (0, class_transformer_1.classToClass)(user) }, company);
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findByEmail(email);
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.WRONG_EMAIL_PASS);
        }
        const passwordMatch = await this.hashProvider.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.WRONG_EMAIL_PASS);
        }
        return user;
    }
};
SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository,
        RefreshTokensRepository_1.RefreshTokensRepository,
        HashProvider_1.HashProvider,
        JwtTokenProvider_1.JwtTokenProvider])
], SessionService);
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map