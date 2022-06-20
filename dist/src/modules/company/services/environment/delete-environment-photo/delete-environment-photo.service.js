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
exports.DeleteEnvironmentPhotoService = void 0;
const common_1 = require("@nestjs/common");
const EnvironmentPhotoRepository_1 = require("../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const EnvironmentRepository_1 = require("../../../repositories/implementations/EnvironmentRepository");
let DeleteEnvironmentPhotoService = class DeleteEnvironmentPhotoService {
    constructor(environmentRepository, environmentPhotoRepository, amazonStorageProvider) {
        this.environmentRepository = environmentRepository;
        this.environmentPhotoRepository = environmentPhotoRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(id) {
        const photo = await this.environmentPhotoRepository.findById(id);
        const splitUrl = photo.photoUrl.split('/');
        await this.amazonStorageProvider.delete({
            fileName: splitUrl[splitUrl.length - 1],
        });
        const deletedPhoto = await this.environmentPhotoRepository.delete(id);
        const environmentData = await this.environmentRepository.findById(deletedPhoto.companyEnvironmentId);
        return environmentData;
    }
};
DeleteEnvironmentPhotoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EnvironmentRepository_1.EnvironmentRepository,
        EnvironmentPhotoRepository_1.EnvironmentPhotoRepository,
        AmazonStorageProvider_1.AmazonStorageProvider])
], DeleteEnvironmentPhotoService);
exports.DeleteEnvironmentPhotoService = DeleteEnvironmentPhotoService;
//# sourceMappingURL=delete-environment-photo.service.js.map