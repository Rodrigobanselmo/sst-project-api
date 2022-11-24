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
exports.SetCompanyClinicsService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
const CompanyClinicRepository_1 = require("./../../../repositories/implementations/CompanyClinicRepository");
let SetCompanyClinicsService = class SetCompanyClinicsService {
    constructor(companyRepository, companyClinicRepository) {
        this.companyRepository = companyRepository;
        this.companyClinicRepository = companyClinicRepository;
    }
    async execute(setCompanyClinicDto, user) {
        if (!setCompanyClinicDto.ids.every((c) => c.companyId === user.targetCompanyId))
            throw new common_1.ForbiddenException(errorMessage_1.ErrorMessageEnum.FORBIDDEN_ACCESS);
        const clinics = await this.companyClinicRepository.set(setCompanyClinicDto, user.targetCompanyId);
        return clinics;
    }
};
SetCompanyClinicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository, CompanyClinicRepository_1.CompanyClinicRepository])
], SetCompanyClinicsService);
exports.SetCompanyClinicsService = SetCompanyClinicsService;
//# sourceMappingURL=set-company-clinics.service.js.map