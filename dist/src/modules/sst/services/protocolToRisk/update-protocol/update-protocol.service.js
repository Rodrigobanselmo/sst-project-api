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
exports.UpdateProtocolToRiskService = void 0;
const common_1 = require("@nestjs/common");
const ProtocolRiskRepository_1 = require("./../../../repositories/implementations/ProtocolRiskRepository");
let UpdateProtocolToRiskService = class UpdateProtocolToRiskService {
    constructor(protocolToRiskRepository) {
        this.protocolToRiskRepository = protocolToRiskRepository;
    }
    async execute(id, updateDto, user) {
        const protocol = await this.protocolToRiskRepository.update(Object.assign({ id, companyId: user.targetCompanyId }, updateDto));
        return protocol;
    }
};
UpdateProtocolToRiskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProtocolRiskRepository_1.ProtocolToRiskRepository])
], UpdateProtocolToRiskService);
exports.UpdateProtocolToRiskService = UpdateProtocolToRiskService;
//# sourceMappingURL=update-protocol.service.js.map