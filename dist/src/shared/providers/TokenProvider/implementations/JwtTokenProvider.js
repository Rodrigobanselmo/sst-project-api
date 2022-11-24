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
exports.JwtTokenProvider = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const DayJSProvider_1 = require("../../DateProvider/implementations/DayJSProvider");
let JwtTokenProvider = class JwtTokenProvider {
    constructor(jwtService, dateProvider) {
        this.jwtService = jwtService;
        this.dateProvider = dateProvider;
    }
    generateToken(payload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
    generateRefreshToken(userId) {
        const secret_refresh_token = process.env.REFRESH_TOKEN_SECRET;
        const expires_in_refresh_token = process.env.REFRESH_TOKEN_EXPIRES;
        const dateNow = this.dateProvider.dateNow();
        const lastChar = expires_in_refresh_token.slice(-1);
        const timeValue = Number(expires_in_refresh_token.slice(0, -1));
        const refreshTokenExpiresDate = this.dateProvider.addTime(dateNow, timeValue, lastChar);
        const refresh_token = this.jwtService.sign({ sub: userId }, {
            expiresIn: expires_in_refresh_token,
            secret: secret_refresh_token,
            privateKey: secret_refresh_token,
        });
        return [refresh_token, refreshTokenExpiresDate];
    }
    verifyIsValidToken(refresh_token, secret_type) {
        let secret;
        if (secret_type === 'refresh') {
            secret = process.env.REFRESH_TOKEN_SECRET;
        }
        else {
            secret = process.env.TOKEN_SECRET;
        }
        try {
            const { sub } = this.jwtService.verify(refresh_token, { secret, publicKey: secret });
            return sub;
        }
        catch (err) {
            if (err.message === 'jwt expired') {
                return 'expired';
            }
            if (err.message === 'invalid signature') {
                return 'invalid';
            }
        }
    }
};
JwtTokenProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, DayJSProvider_1.DayJSProvider])
], JwtTokenProvider);
exports.JwtTokenProvider = JwtTokenProvider;
//# sourceMappingURL=JwtTokenProvider.js.map