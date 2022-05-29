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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyPermissionByToken = exports.CreateUserService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const HashProvider_1 = require("../../../../../shared/providers/HashProvider/implementations/HashProvider");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
const find_by_token_service_1 = require("../../invites/find-by-token/find-by-token.service");
let CreateUserService = class CreateUserService {
    constructor(userRepository, findByTokenService, dateProvider, hashProvider) {
        this.userRepository = userRepository;
        this.findByTokenService = findByTokenService;
        this.dateProvider = dateProvider;
        this.hashProvider = hashProvider;
    }
    async execute(_a) {
        var { token, password } = _a, restCreateUserDto = __rest(_a, ["token", "password"]);
        const passHash = await this.hashProvider.createHash(password);
        const userAlreadyExist = await this.userRepository.findByEmail(restCreateUserDto.email);
        if (userAlreadyExist)
            throw new common_1.BadRequestException(errorMessage_1.ErrorAuthEnum.USER_ALREADY_EXIST);
        const companies = await (0, exports.getCompanyPermissionByToken)(token, restCreateUserDto.email, this.findByTokenService, this.dateProvider);
        const userData = Object.assign(Object.assign({}, restCreateUserDto), { password: passHash });
        const user = await this.userRepository.create(userData, companies);
        return user;
    }
};
CreateUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository,
        find_by_token_service_1.FindByTokenService,
        DayJSProvider_1.DayJSProvider,
        HashProvider_1.HashProvider])
], CreateUserService);
exports.CreateUserService = CreateUserService;
const getCompanyPermissionByToken = async (token, email, findByTokenService, dateProvider) => {
    if (!token)
        return [];
    const invite = await findByTokenService.execute(token);
    const currentDate = dateProvider.dateNow();
    const expires_date = new Date(dateProvider.convertToUTC(invite.expires_date));
    if (invite.email !== email)
        throw new common_1.BadRequestException('Invite token not valid for this email');
    if (currentDate > expires_date)
        throw new common_1.BadRequestException('Invite token is expired');
    const companies = [
        {
            permissions: invite.permissions,
            roles: invite.roles,
            companyId: invite.companyId,
        },
    ];
    return companies;
};
exports.getCompanyPermissionByToken = getCompanyPermissionByToken;
//# sourceMappingURL=create-user.service.js.map