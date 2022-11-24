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
exports.UpdateEnvironmentPhotoService = void 0;
const common_1 = require("@nestjs/common");
const EnvironmentPhotoRepository_1 = require("../../../repositories/implementations/EnvironmentPhotoRepository");
const EnvironmentRepository_1 = require("../../../repositories/implementations/EnvironmentRepository");
let UpdateEnvironmentPhotoService = class UpdateEnvironmentPhotoService {
    constructor(environmentRepository, environmentPhotoRepository) {
        this.environmentRepository = environmentRepository;
        this.environmentPhotoRepository = environmentPhotoRepository;
    }
    async execute(id, updatePhotoEnvironmentDto) {
        const environmentPhoto = await this.environmentPhotoRepository.update(Object.assign(Object.assign({}, updatePhotoEnvironmentDto), { id }));
        const environmentData = await this.environmentRepository.findById(environmentPhoto.companyCharacterizationId);
        return environmentData;
    }
};
UpdateEnvironmentPhotoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EnvironmentRepository_1.EnvironmentRepository, EnvironmentPhotoRepository_1.EnvironmentPhotoRepository])
], UpdateEnvironmentPhotoService);
exports.UpdateEnvironmentPhotoService = UpdateEnvironmentPhotoService;
//# sourceMappingURL=update-environment-photo.service.js.map