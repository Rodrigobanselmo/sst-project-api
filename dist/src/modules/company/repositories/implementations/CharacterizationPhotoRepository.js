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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterizationPhotoRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const characterization_photo_entity_1 = require("../../entities/characterization-photo.entity");
let CharacterizationPhotoRepository = class CharacterizationPhotoRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMany(characterizationPhoto) {
        const characterizations = await this.prisma.companyCharacterizationPhoto.createMany({
            data: characterizationPhoto.map((_a) => {
                var rest = __rest(_a, []);
                return (Object.assign({}, rest));
            }),
        });
        return characterizations;
    }
    async update(_a) {
        var { id } = _a, characterizationPhotoDto = __rest(_a, ["id"]);
        const characterization = await this.prisma.companyCharacterizationPhoto.update({
            where: { id: id || 'no-id' },
            data: Object.assign({}, characterizationPhotoDto),
        });
        return new characterization_photo_entity_1.CharacterizationPhotoEntity(characterization);
    }
    async upsert(_a) {
        var { id, companyCharacterizationId: characterizationId } = _a, characterizationPhotoDto = __rest(_a, ["id", "companyCharacterizationId"]);
        const characterization = await this.prisma.companyCharacterizationPhoto.upsert({
            where: { id: id || 'no-id' },
            create: Object.assign(Object.assign({}, characterizationPhotoDto), { companyCharacterizationId: characterizationId, name: characterizationPhotoDto.name }),
            update: Object.assign({}, characterizationPhotoDto),
        });
        return new characterization_photo_entity_1.CharacterizationPhotoEntity(characterization);
    }
    async findByCharacterization(characterizationId) {
        const characterizations = await this.prisma.companyCharacterizationPhoto.findMany({
            where: { companyCharacterizationId: characterizationId },
        });
        return characterizations.map((characterization) => new characterization_photo_entity_1.CharacterizationPhotoEntity(characterization));
    }
    async findById(id) {
        const characterization = await this.prisma.companyCharacterizationPhoto.findUnique({
            where: { id },
        });
        return new characterization_photo_entity_1.CharacterizationPhotoEntity(characterization);
    }
    async delete(id) {
        const characterization = await this.prisma.companyCharacterizationPhoto.delete({
            where: { id },
        });
        return new characterization_photo_entity_1.CharacterizationPhotoEntity(characterization);
    }
};
CharacterizationPhotoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CharacterizationPhotoRepository);
exports.CharacterizationPhotoRepository = CharacterizationPhotoRepository;
//# sourceMappingURL=CharacterizationPhotoRepository.js.map