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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsertCharacterizationService = void 0;
const common_1 = require("@nestjs/common");
const image_size_1 = __importDefault(require("image-size"));
const uuid_1 = require("uuid");
const CharacterizationPhotoRepository_1 = require("../../../repositories/implementations/CharacterizationPhotoRepository");
const CharacterizationRepository_1 = require("../../../repositories/implementations/CharacterizationRepository");
let UpsertCharacterizationService = class UpsertCharacterizationService {
    constructor(characterizationRepository, characterizationPhotoRepository) {
        this.characterizationRepository = characterizationRepository;
        this.characterizationPhotoRepository = characterizationPhotoRepository;
    }
    async execute(_a, workspaceId, userPayloadDto, files) {
        var { photos } = _a, upsertCharacterizationDto = __rest(_a, ["photos"]);
        const companyId = userPayloadDto.targetCompanyId;
        const characterization = await this.characterizationRepository.upsert(Object.assign(Object.assign({}, upsertCharacterizationDto), { companyId, workspaceId: workspaceId }));
        const urls = await this.upload(companyId, files);
        if (photos)
            await this.characterizationPhotoRepository.createMany(photos.map((photo, index) => ({
                companyCharacterizationId: characterization.id,
                photoUrl: urls[index][0],
                isVertical: urls[index][1],
                name: photo,
            })));
        const characterizationData = await this.characterizationRepository.findById(characterization.id);
        return characterizationData;
    }
    async upload(companyId, files) {
        const urls = await Promise.all(files.map(async (file) => {
            const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
            const path = companyId + '/characterization/' + (0, uuid_1.v4)() + '.' + fileType;
            const dimensions = (0, image_size_1.default)(file.buffer);
            const isVertical = dimensions.width < dimensions.height;
        }));
        return urls;
    }
};
UpsertCharacterizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CharacterizationRepository_1.CharacterizationRepository,
        CharacterizationPhotoRepository_1.CharacterizationPhotoRepository])
], UpsertCharacterizationService);
exports.UpsertCharacterizationService = UpsertCharacterizationService;
//# sourceMappingURL=upsert-characterization.service.js.map