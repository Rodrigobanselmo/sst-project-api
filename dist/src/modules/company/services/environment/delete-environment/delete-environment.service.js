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
exports.DeleteEnvironmentService = void 0;
const HomoGroupRepository_1 = require("./../../../repositories/implementations/HomoGroupRepository");
const AmazonStorageProvider_1 = require("./../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const EnvironmentPhotoRepository_1 = require("./../../../repositories/implementations/EnvironmentPhotoRepository");
const common_1 = require("@nestjs/common");
const EnvironmentRepository_1 = require("../../../repositories/implementations/EnvironmentRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let DeleteEnvironmentService = class DeleteEnvironmentService {
    constructor(environmentRepository, environmentPhotoRepository, amazonStorageProvider, homoGroupRepository) {
        this.environmentRepository = environmentRepository;
        this.environmentPhotoRepository = environmentPhotoRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.homoGroupRepository = homoGroupRepository;
    }
    async execute(id, workspaceId, userPayloadDto) {
        const photos = await this.environmentPhotoRepository.findByEnvironment(id);
        await Promise.all(photos.map(async (photo) => {
            const splitUrl = photo.photoUrl.split('.com/');
            await this.amazonStorageProvider.delete({
                fileName: splitUrl[splitUrl.length - 1],
            });
            await this.environmentPhotoRepository.delete(photo.id);
        }));
        const environments = await this.environmentRepository.findById(id);
        if (environments.companyId !== userPayloadDto.targetCompanyId) {
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);
        }
        await this.homoGroupRepository.deleteById(id);
        return environments;
    }
};
DeleteEnvironmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EnvironmentRepository_1.EnvironmentRepository,
        EnvironmentPhotoRepository_1.EnvironmentPhotoRepository,
        AmazonStorageProvider_1.AmazonStorageProvider,
        HomoGroupRepository_1.HomoGroupRepository])
], DeleteEnvironmentService);
exports.DeleteEnvironmentService = DeleteEnvironmentService;
//# sourceMappingURL=delete-environment.service.js.map