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
exports.DeleteCharacterizationService = void 0;
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const HomoGroupRepository_1 = require("./../../../repositories/implementations/HomoGroupRepository");
const CharacterizationPhotoRepository_1 = require("./../../../repositories/implementations/CharacterizationPhotoRepository");
const AmazonStorageProvider_1 = require("./../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const common_1 = require("@nestjs/common");
const CharacterizationRepository_1 = require("../../../repositories/implementations/CharacterizationRepository");
let DeleteCharacterizationService = class DeleteCharacterizationService {
    constructor(characterizationRepository, characterizationPhotoRepository, amazonStorageProvider, homoGroupRepository) {
        this.characterizationRepository = characterizationRepository;
        this.characterizationPhotoRepository = characterizationPhotoRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.homoGroupRepository = homoGroupRepository;
    }
    async execute(id, workspaceId, userPayloadDto) {
        const photos = await this.characterizationPhotoRepository.findByCharacterization(id);
        await Promise.all(photos.map(async (photo) => {
            const splitUrl = photo.photoUrl.split('.com/');
            await this.amazonStorageProvider.delete({
                fileName: splitUrl[splitUrl.length - 1],
            });
            await this.characterizationPhotoRepository.delete(photo.id);
        }));
        const characterizations = await this.characterizationRepository.findById(id);
        if (characterizations.companyId !== userPayloadDto.targetCompanyId) {
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);
        }
        characterizations.profiles.forEach(async (profile) => {
            await this.characterizationRepository.delete(profile.id, userPayloadDto.targetCompanyId, workspaceId);
            await this.homoGroupRepository.deleteById(profile.id);
        });
        await this.characterizationRepository.delete(id, userPayloadDto.targetCompanyId, workspaceId);
        await this.homoGroupRepository.deleteById(id);
        return characterizations;
    }
};
DeleteCharacterizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CharacterizationRepository_1.CharacterizationRepository,
        CharacterizationPhotoRepository_1.CharacterizationPhotoRepository,
        AmazonStorageProvider_1.AmazonStorageProvider,
        HomoGroupRepository_1.HomoGroupRepository])
], DeleteCharacterizationService);
exports.DeleteCharacterizationService = DeleteCharacterizationService;
//# sourceMappingURL=delete-characterization.service.js.map