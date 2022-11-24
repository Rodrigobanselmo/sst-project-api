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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllByHierarchyService = void 0;
const common_1 = require("@nestjs/common");
const clone_1 = __importDefault(require("clone"));
const RiskRepository_1 = require("../../../repositories/implementations/RiskRepository");
const riskData_entity_1 = require("../../../entities/riskData.entity");
let FindAllByHierarchyService = class FindAllByHierarchyService {
    constructor(riskRepository) {
        this.riskRepository = riskRepository;
    }
    async execute(hierarchyId, companyId) {
        const risks = await this.riskRepository.findRiskDataByHierarchies([hierarchyId], companyId);
        console.log(9);
        const riskDataReturn = [];
        risks.forEach((risk) => {
            risk.riskFactorData.forEach((riskData) => {
                const riskCopy = (0, clone_1.default)(risk);
                riskCopy.riskFactorData = undefined;
                riskData.riskFactor = riskCopy;
                riskDataReturn.push(riskData);
            });
        });
        return riskDataReturn.map((riskData) => new riskData_entity_1.RiskFactorDataEntity(riskData));
    }
};
FindAllByHierarchyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskRepository_1.RiskRepository])
], FindAllByHierarchyService);
exports.FindAllByHierarchyService = FindAllByHierarchyService;
//# sourceMappingURL=find-by-hierarchy.service.js.map