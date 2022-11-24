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
exports.AddCertificationESocialService = void 0;
const CompanyCertRepository_1 = require("./../../../../repositories/implementations/CompanyCertRepository");
const common_1 = require("@nestjs/common");
const ESocialMethodsProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider");
let AddCertificationESocialService = class AddCertificationESocialService {
    constructor(companyCertRepository, eSocialMethodsProvider) {
        this.companyCertRepository = companyCertRepository;
        this.eSocialMethodsProvider = eSocialMethodsProvider;
    }
    async execute(file, { password }, user) {
        const convertedPem = await this.eSocialMethodsProvider.convertPfxToPem({
            file,
            password,
        });
        await this.companyCertRepository.upsert(Object.assign(Object.assign({}, convertedPem), { companyId: user.targetCompanyId }));
        return;
    }
};
AddCertificationESocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyCertRepository_1.CompanyCertRepository, ESocialMethodsProvider_1.ESocialMethodsProvider])
], AddCertificationESocialService);
exports.AddCertificationESocialService = AddCertificationESocialService;
//# sourceMappingURL=add-certificate.service.js.map