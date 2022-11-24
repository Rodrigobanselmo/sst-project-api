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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCompanyPhotoService = void 0;
const image_size_1 = __importDefault(require("image-size"));
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
let AddCompanyPhotoService = class AddCompanyPhotoService {
    constructor(companyRepository, amazonStorageProvider) {
        this.companyRepository = companyRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(userPayloadDto, file) {
        const companyId = userPayloadDto.targetCompanyId;
        const [photoUrl] = await this.upload(companyId, file);
        const companyData = await this.companyRepository.update({
            companyId,
            logoUrl: photoUrl,
        });
        return companyData;
    }
    async upload(companyId, file) {
        const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
        const path = companyId + '/company/' + (0, uuid_1.v4)() + '.' + fileType;
        const { url } = await this.amazonStorageProvider.upload({
            file: file.buffer,
            isPublic: true,
            fileName: path,
        });
        const dimensions = (0, image_size_1.default)(file.buffer);
        const isVertical = dimensions.width < dimensions.height;
        return [url, isVertical];
    }
};
AddCompanyPhotoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository, AmazonStorageProvider_1.AmazonStorageProvider])
], AddCompanyPhotoService);
exports.AddCompanyPhotoService = AddCompanyPhotoService;
//# sourceMappingURL=add-company-photo.service.js.map