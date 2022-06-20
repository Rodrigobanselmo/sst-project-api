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
exports.UpsertEnvironmentService = void 0;
const common_1 = require("@nestjs/common");
const stream_1 = require("stream");
const uuid_1 = require("uuid");
const EnvironmentPhotoRepository_1 = require("../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const EnvironmentRepository_1 = require("../../../repositories/implementations/EnvironmentRepository");
let UpsertEnvironmentService = class UpsertEnvironmentService {
    constructor(environmentRepository, environmentPhotoRepository, amazonStorageProvider) {
        this.environmentRepository = environmentRepository;
        this.environmentPhotoRepository = environmentPhotoRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(_a, workspaceId, userPayloadDto, files) {
        var { photos } = _a, upsertEnvironmentDto = __rest(_a, ["photos"]);
        const companyId = userPayloadDto.targetCompanyId;
        const environment = await this.environmentRepository.upsert(Object.assign(Object.assign({}, upsertEnvironmentDto), { companyId, workspaceId: workspaceId }));
        const urls = await this.upload(companyId, files);
        if (photos)
            await this.environmentPhotoRepository.createMany(photos.map((photo, index) => ({
                companyEnvironmentId: environment.id,
                photoUrl: urls[index],
                name: photo,
            })));
        const environmentData = await this.environmentRepository.findById(environment.id);
        return environmentData;
    }
    async upload(companyId, files) {
        const urls = await Promise.all(files.map(async (file) => {
            const stream = stream_1.Readable.from(file.buffer);
            const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
            const path = companyId + '/environment/' + (0, uuid_1.v4)() + '.' + fileType;
            const { url } = await this.amazonStorageProvider.upload({
                file: stream,
                isPublic: true,
                fileName: path,
            });
            return url;
        }));
        return urls;
    }
};
UpsertEnvironmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EnvironmentRepository_1.EnvironmentRepository,
        EnvironmentPhotoRepository_1.EnvironmentPhotoRepository,
        AmazonStorageProvider_1.AmazonStorageProvider])
], UpsertEnvironmentService);
exports.UpsertEnvironmentService = UpsertEnvironmentService;
//# sourceMappingURL=upsert-environment.service.js.map