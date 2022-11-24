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
exports.CopyProtocolToRiskService = void 0;
const ProtocolRiskRepository_1 = require("./../../../repositories/implementations/ProtocolRiskRepository");
const common_1 = require("@nestjs/common");
let CopyProtocolToRiskService = class CopyProtocolToRiskService {
    constructor(protocolToRiskRepository) {
        this.protocolToRiskRepository = protocolToRiskRepository;
    }
    async execute(copyProtocolToRiskDto, user) {
        const FromProtocolFactor = await this.protocolToRiskRepository.findNude({
            where: { companyId: copyProtocolToRiskDto.fromCompanyId },
        });
        const ActualProtocolFactor = await this.protocolToRiskRepository.findNude({
            where: { companyId: user.targetCompanyId },
            select: { riskId: true, protocolId: true },
        });
        const copyData = FromProtocolFactor.map((protocol) => {
            const found = ActualProtocolFactor.find((aProtocol) => aProtocol.protocolId === protocol.protocolId && aProtocol.riskId === protocol.riskId);
            if (found)
                return null;
            return protocol;
        }).filter((i) => i);
        const ProtocolFactor = await this.protocolToRiskRepository.createMany({
            data: copyData,
            companyId: user.targetCompanyId,
        });
        return ProtocolFactor;
    }
};
CopyProtocolToRiskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProtocolRiskRepository_1.ProtocolToRiskRepository])
], CopyProtocolToRiskService);
exports.CopyProtocolToRiskService = CopyProtocolToRiskService;
//# sourceMappingURL=copy-protocol.service.js.map