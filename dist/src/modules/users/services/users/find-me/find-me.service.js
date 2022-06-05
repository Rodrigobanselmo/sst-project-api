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
exports.FindMeService = void 0;
const common_1 = require("@nestjs/common");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
let FindMeService = class FindMeService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id, companyId) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_1.BadRequestException(`user with id ${id} not found`);
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
        const company = companies.find((c) => c.companyId === companyId) ||
            companies[0] ||
            {};
        return Object.assign(Object.assign({}, user), company);
    }
};
FindMeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository])
], FindMeService);
exports.FindMeService = FindMeService;
//# sourceMappingURL=find-me.service.js.map