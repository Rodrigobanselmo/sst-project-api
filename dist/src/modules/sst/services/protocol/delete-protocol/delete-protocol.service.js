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
exports.DeleteSoftProtocolsService = void 0;
const isMater_1 = require("./../../../../../shared/utils/isMater");
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const ProtocolRepository_1 = require("../../../repositories/implementations/ProtocolRepository");
let DeleteSoftProtocolsService = class DeleteSoftProtocolsService {
    constructor(protocolRepository) {
        this.protocolRepository = protocolRepository;
    }
    async execute(id, user) {
        const userMain = (0, isMater_1.isMaster)(user);
        if (!userMain.isMaster) {
            const protocolFound = await this.protocolRepository.findFirstNude({
                where: {
                    id,
                    companyId: user.targetCompanyId,
                },
            });
            if (!(protocolFound === null || protocolFound === void 0 ? void 0 : protocolFound.id))
                throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.PROTOCOL_NOT_FOUND);
        }
        const protocol = await this.protocolRepository.deleteSoft(id);
        return protocol;
    }
};
DeleteSoftProtocolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProtocolRepository_1.ProtocolRepository])
], DeleteSoftProtocolsService);
exports.DeleteSoftProtocolsService = DeleteSoftProtocolsService;
//# sourceMappingURL=delete-protocol.service.js.map