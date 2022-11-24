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
exports.DeleteCharacterizationPhotoService = void 0;
const common_1 = require("@nestjs/common");
const CharacterizationPhotoRepository_1 = require("../../../repositories/implementations/CharacterizationPhotoRepository");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const CharacterizationRepository_1 = require("../../../repositories/implementations/CharacterizationRepository");
let DeleteCharacterizationPhotoService = class DeleteCharacterizationPhotoService {
    constructor(characterizationRepository, characterizationPhotoRepository, amazonStorageProvider) {
        this.characterizationRepository = characterizationRepository;
        this.characterizationPhotoRepository = characterizationPhotoRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(id) {
        const photo = await this.characterizationPhotoRepository.findById(id);
        const splitUrl = photo.photoUrl.split('.com/');
        await this.amazonStorageProvider.delete({
            fileName: splitUrl[splitUrl.length - 1],
        });
        const deletedPhoto = await this.characterizationPhotoRepository.delete(id);
        const characterizationData = await this.characterizationRepository.findById(deletedPhoto.companyCharacterizationId);
        return characterizationData;
    }
};
DeleteCharacterizationPhotoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CharacterizationRepository_1.CharacterizationRepository,
        CharacterizationPhotoRepository_1.CharacterizationPhotoRepository,
        AmazonStorageProvider_1.AmazonStorageProvider])
], DeleteCharacterizationPhotoService);
exports.DeleteCharacterizationPhotoService = DeleteCharacterizationPhotoService;
//# sourceMappingURL=delete-characterization-photo.service.js.map