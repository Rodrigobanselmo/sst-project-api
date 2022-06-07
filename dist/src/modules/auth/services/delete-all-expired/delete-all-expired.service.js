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
exports.DeleteAllExpiredService = void 0;
const common_1 = require("@nestjs/common");
const RefreshTokensRepository_1 = require("../../../../modules/auth/repositories/implementations/RefreshTokensRepository");
const DayJSProvider_1 = require("../../../../shared/providers/DateProvider/implementations/DayJSProvider");
let DeleteAllExpiredService = class DeleteAllExpiredService {
    constructor(refreshTokensRepository, dateProvider) {
        this.refreshTokensRepository = refreshTokensRepository;
        this.dateProvider = dateProvider;
    }
    async execute() {
        const currentDate = this.dateProvider.dateNow();
        return this.refreshTokensRepository.deleteAllOldTokens(currentDate);
    }
};
DeleteAllExpiredService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RefreshTokensRepository_1.RefreshTokensRepository,
        DayJSProvider_1.DayJSProvider])
], DeleteAllExpiredService);
exports.DeleteAllExpiredService = DeleteAllExpiredService;
//# sourceMappingURL=delete-all-expired.service.js.map