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
exports.VerifyGoogleLoginService = void 0;
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const common_1 = require("@nestjs/common");
const FirebaseProvider_1 = require("../../../../../shared/providers/FirebaseProvider/FirebaseProvider");
const UsersRepository_1 = require("../../../../users/repositories/implementations/UsersRepository");
let VerifyGoogleLoginService = class VerifyGoogleLoginService {
    constructor(usersRepository, firebaseProvider) {
        this.usersRepository = usersRepository;
        this.firebaseProvider = firebaseProvider;
    }
    async execute({ token }) {
        try {
            const result = await this.firebaseProvider.validateGoogleToken(token);
            const user = await this.usersRepository.findByGoogleExternalId(result.user.uid);
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                throw new common_1.BadRequestException(errorMessage_1.ErrorInvitesEnum.GOOGLE_USER_NOT_EXIST);
            }
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException(errorMessage_1.ErrorInvitesEnum.GOOGLE_USER_NOT_EXIST);
        }
    }
};
VerifyGoogleLoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository, FirebaseProvider_1.FirebaseProvider])
], VerifyGoogleLoginService);
exports.VerifyGoogleLoginService = VerifyGoogleLoginService;
//# sourceMappingURL=verify-google-login.service.js.map