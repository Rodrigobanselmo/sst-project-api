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
exports.DeleteSoftGenerateSourceService = void 0;
const common_1 = require("@nestjs/common");
const generateSource_entity_1 = require("../../../entities/generateSource.entity");
const isMater_1 = require("../../../../../shared/utils/isMater");
const GenerateSourceRepository_1 = require("../../../repositories/implementations/GenerateSourceRepository");
let DeleteSoftGenerateSourceService = class DeleteSoftGenerateSourceService {
    constructor(generateSourceRepository) {
        this.generateSourceRepository = generateSourceRepository;
    }
    async execute(id, userPayloadDto) {
        const user = (0, isMater_1.isMaster)(userPayloadDto);
        const companyId = user.companyId;
        let generateSource;
        if (user.isMaster) {
            generateSource = await this.generateSourceRepository.DeleteByIdSoft(id);
        }
        else {
            generateSource =
                await this.generateSourceRepository.DeleteByCompanyAndIdSoft(id, companyId);
        }
        if (!generateSource.id)
            throw new common_1.NotFoundException('data not found');
        return generateSource;
    }
};
DeleteSoftGenerateSourceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [GenerateSourceRepository_1.GenerateSourceRepository])
], DeleteSoftGenerateSourceService);
exports.DeleteSoftGenerateSourceService = DeleteSoftGenerateSourceService;
//# sourceMappingURL=delete-soft-generate-source.service.js.map