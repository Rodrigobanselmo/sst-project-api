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
exports.RefreshTokensRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const refresh_tokens_entity_1 = require("../../entities/refresh-tokens.entity");
let RefreshTokensRepository = class RefreshTokensRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(refresh_token, userId, expires_date) {
        const refreshToken = await this.prisma.refreshToken.create({
            data: {
                refresh_token,
                expires_date,
                userId,
            },
        });
        return new refresh_tokens_entity_1.RefreshTokenEntity(refreshToken);
    }
    async findById(id) {
        const userTokens = await this.prisma.refreshToken.findUnique({
            where: { id },
        });
        if (!userTokens)
            return;
        return new refresh_tokens_entity_1.RefreshTokenEntity(userTokens);
    }
    async findByRefreshToken(refresh_token) {
        const userTokens = await this.prisma.refreshToken.findFirst({
            where: { refresh_token },
        });
        if (!userTokens)
            return;
        return new refresh_tokens_entity_1.RefreshTokenEntity(userTokens);
    }
    async findByUserIdAndRefreshToken(userId, refresh_token) {
        const userTokens = await this.prisma.refreshToken.findFirst({
            where: { userId, refresh_token },
        });
        if (!userTokens)
            return;
        return new refresh_tokens_entity_1.RefreshTokenEntity(userTokens);
    }
    async deleteById(id) {
        await this.prisma.refreshToken.delete({ where: { id } });
    }
    async deleteAllOldTokens(date) {
        const deletedResult = await this.prisma.refreshToken.deleteMany({
            where: {
                expires_date: {
                    lte: date,
                },
            },
        });
        return deletedResult;
    }
    async deleteByRefreshToken(refresh_token) {
        await this.prisma.refreshToken.deleteMany({ where: { refresh_token } });
    }
};
RefreshTokensRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefreshTokensRepository);
exports.RefreshTokensRepository = RefreshTokensRepository;
//# sourceMappingURL=RefreshTokensRepository.js.map