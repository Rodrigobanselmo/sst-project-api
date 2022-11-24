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
exports.FindByIdService = void 0;
const common_1 = require("@nestjs/common");
const RiskGroupDataRepository_1 = require("../../../repositories/implementations/RiskGroupDataRepository");
let FindByIdService = class FindByIdService {
    constructor(riskGroupDataRepository) {
        this.riskGroupDataRepository = riskGroupDataRepository;
    }
    async execute(id, companyId) {
        const riskGroupData = await this.riskGroupDataRepository.findById(id, companyId, {
            include: {
                usersSignatures: { include: { user: true } },
                professionalsSignatures: {
                    include: { professional: { include: { professional: true } } },
                },
            },
        });
        return riskGroupData;
    }
};
FindByIdService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskGroupDataRepository_1.RiskGroupDataRepository])
], FindByIdService);
exports.FindByIdService = FindByIdService;
//# sourceMappingURL=find-by-id.service.js.map