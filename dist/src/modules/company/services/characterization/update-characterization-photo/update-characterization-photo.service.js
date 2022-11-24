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
exports.UpdateCharacterizationPhotoService = void 0;
const common_1 = require("@nestjs/common");
const CharacterizationPhotoRepository_1 = require("../../../repositories/implementations/CharacterizationPhotoRepository");
const CharacterizationRepository_1 = require("../../../repositories/implementations/CharacterizationRepository");
let UpdateCharacterizationPhotoService = class UpdateCharacterizationPhotoService {
    constructor(characterizationRepository, characterizationPhotoRepository) {
        this.characterizationRepository = characterizationRepository;
        this.characterizationPhotoRepository = characterizationPhotoRepository;
    }
    async execute(id, updatePhotoCharacterizationDto) {
        const characterizationPhoto = await this.characterizationPhotoRepository.update(Object.assign(Object.assign({}, updatePhotoCharacterizationDto), { id }));
        const characterizationData = await this.characterizationRepository.findById(characterizationPhoto.companyCharacterizationId);
        return characterizationData;
    }
};
UpdateCharacterizationPhotoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CharacterizationRepository_1.CharacterizationRepository,
        CharacterizationPhotoRepository_1.CharacterizationPhotoRepository])
], UpdateCharacterizationPhotoService);
exports.UpdateCharacterizationPhotoService = UpdateCharacterizationPhotoService;
//# sourceMappingURL=update-characterization-photo.service.js.map