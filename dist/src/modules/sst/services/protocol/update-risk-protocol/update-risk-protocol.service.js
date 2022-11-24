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
exports.UpdateRiskProtocolsService = void 0;
const common_1 = require("@nestjs/common");
const ProtocolRepository_1 = require("../../../repositories/implementations/ProtocolRepository");
let UpdateRiskProtocolsService = class UpdateRiskProtocolsService {
    constructor(protocolRepository) {
        this.protocolRepository = protocolRepository;
    }
    async execute(UpsertProtocolsDto, user) {
        const protocol = await this.protocolRepository.updateProtocolRiskREMOVE(Object.assign(Object.assign({}, UpsertProtocolsDto), { companyId: user.targetCompanyId }));
        return protocol;
    }
};
UpdateRiskProtocolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProtocolRepository_1.ProtocolRepository])
], UpdateRiskProtocolsService);
exports.UpdateRiskProtocolsService = UpdateRiskProtocolsService;
//# sourceMappingURL=update-risk-protocol.service.js.map