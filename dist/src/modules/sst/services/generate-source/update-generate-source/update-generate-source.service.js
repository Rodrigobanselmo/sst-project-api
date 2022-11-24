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
exports.UpdateGenerateSourceService = void 0;
const common_1 = require("@nestjs/common");
const GenerateSourceRepository_1 = require("../../../repositories/implementations/GenerateSourceRepository");
const isMater_1 = require("../../../../../shared/utils/isMater");
let UpdateGenerateSourceService = class UpdateGenerateSourceService {
    constructor(generateSourceRepository) {
        this.generateSourceRepository = generateSourceRepository;
    }
    async execute(id, updateGenerateSourceDto, userPayloadDto) {
        const user = (0, isMater_1.isMaster)(userPayloadDto, updateGenerateSourceDto.companyId);
        const companyId = user.companyId;
        const system = user.isSystem && user.companyId === updateGenerateSourceDto.companyId;
        const generateSource = await this.generateSourceRepository.findById(id, companyId);
        if (!(generateSource === null || generateSource === void 0 ? void 0 : generateSource.id))
            throw new common_1.NotFoundException('data not found');
        const generateSourceUpdated = await this.generateSourceRepository.update(Object.assign({ id, riskId: generateSource.riskId }, updateGenerateSourceDto), system, companyId);
        if (!generateSourceUpdated.id)
            throw new common_1.NotFoundException('data not found');
        return generateSourceUpdated;
    }
};
UpdateGenerateSourceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [GenerateSourceRepository_1.GenerateSourceRepository])
], UpdateGenerateSourceService);
exports.UpdateGenerateSourceService = UpdateGenerateSourceService;
//# sourceMappingURL=update-generate-source.service.js.map