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
exports.FindAllByCompanyService = void 0;
const common_1 = require("@nestjs/common");
const user_payload_dto_1 = require("../../../../../shared/dto/user-payload.dto");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
let FindAllByCompanyService = class FindAllByCompanyService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(user) {
        const users = await this.userRepository.findAllByCompany(user.targetCompanyId);
        users.map((userCompany) => {
            userCompany.companies = userCompany.companies
                .map((company) => {
                if (company.companyId === user.targetCompanyId) {
                    return company;
                }
                return null;
            })
                .filter((company) => company !== null);
            return userCompany;
        });
        return users;
    }
};
FindAllByCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UsersRepository])
], FindAllByCompanyService);
exports.FindAllByCompanyService = FindAllByCompanyService;
//# sourceMappingURL=find-all.service.js.map