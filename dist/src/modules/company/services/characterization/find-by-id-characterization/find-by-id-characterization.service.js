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
exports.FindByIdCharacterizationService = void 0;
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const common_1 = require("@nestjs/common");
const CharacterizationRepository_1 = require("../../../repositories/implementations/CharacterizationRepository");
let FindByIdCharacterizationService = class FindByIdCharacterizationService {
    constructor(characterizationRepository) {
        this.characterizationRepository = characterizationRepository;
    }
    async execute(id, userPayloadDto) {
        const characterization = await this.characterizationRepository.findById(id, {
            getRiskData: true,
            include: {
                photos: true,
            },
        });
        if (characterization.companyId != userPayloadDto.targetCompanyId)
            throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.CHARACTERIZATION_NOT_FOUND);
        return characterization;
    }
};
FindByIdCharacterizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CharacterizationRepository_1.CharacterizationRepository])
], FindByIdCharacterizationService);
exports.FindByIdCharacterizationService = FindByIdCharacterizationService;
//# sourceMappingURL=find-by-id-characterization.service.js.map