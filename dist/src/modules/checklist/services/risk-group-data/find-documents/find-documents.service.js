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
exports.FindDocumentsService = void 0;
const common_1 = require("@nestjs/common");
const RiskDocumentRepository_1 = require("../../../repositories/implementations/RiskDocumentRepository");
let FindDocumentsService = class FindDocumentsService {
    constructor(riskDocumentRepository) {
        this.riskDocumentRepository = riskDocumentRepository;
    }
    async execute(riskGroupId, companyId) {
        const riskGroupData = await this.riskDocumentRepository.findByRiskGroupAndCompany(riskGroupId, companyId);
        return riskGroupData;
    }
};
FindDocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskDocumentRepository_1.RiskDocumentRepository])
], FindDocumentsService);
exports.FindDocumentsService = FindDocumentsService;
//# sourceMappingURL=find-documents.service.js.map