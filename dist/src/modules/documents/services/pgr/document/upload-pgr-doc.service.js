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
exports.PgrUploadService = void 0;
const create_1 = require("./../../../docx/docs/pgr/create");
const common_1 = require("@nestjs/common");
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const stream_1 = require("stream");
const uuid_1 = require("uuid");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const downloadImageFile_1 = require("../../../../../shared/utils/downloadImageFile");
const RiskDocumentRepository_1 = require("../../../../checklist/repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("../../../../checklist/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const document_1 = require("../../../docx/base/config/document");
let PgrUploadService = class PgrUploadService {
    constructor(riskGroupDataRepository, riskDocumentRepository, amazonStorageProvider, hierarchyRepository) {
        this.riskGroupDataRepository = riskGroupDataRepository;
        this.riskDocumentRepository = riskDocumentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(upsertPgrDto, userPayloadDto) {
        const url = 'https://prod-simplesst-docs.s3.amazonaws.com/b8635456-334e-4d6e-ac43-cfe5663aee17/environment/dcf93c91-815a-4b12-8a68-a6f39d86711b.png';
        const example_image_1 = await (0, downloadImageFile_1.downloadImageFile)(url, `tmp/${(0, uuid_1.v4)()}.${(0, downloadImageFile_1.getExtensionFromUrl)(url)}`);
        console.log(example_image_1);
        const version = 'Março/2022 – REV. 03';
        const sections = new create_1.CreatePgr({
            version,
            logo: example_image_1,
        }).create();
        const doc = (0, document_1.createBaseDocument)(sections);
        fs_1.default.unlinkSync(example_image_1);
        const b64string = await docx_1.Packer.toBase64String(doc);
        const buffer = Buffer.from(b64string, 'base64');
        const fileName = 'delete.docx';
        return { buffer, fileName };
    }
    async upload(fileBuffer, fileName, upsertPgrDto, company) {
        const stream = stream_1.Readable.from(fileBuffer);
        const { url } = await this.amazonStorageProvider.upload({
            file: stream,
            fileName: company.id + '/pgr/' + fileName,
        });
        const doc = await this.riskDocumentRepository.upsert(Object.assign(Object.assign({}, upsertPgrDto), { companyId: company.id, fileUrl: url }));
        return doc;
    }
};
PgrUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskGroupDataRepository_1.RiskGroupDataRepository,
        RiskDocumentRepository_1.RiskDocumentRepository,
        AmazonStorageProvider_1.AmazonStorageProvider,
        HierarchyRepository_1.HierarchyRepository])
], PgrUploadService);
exports.PgrUploadService = PgrUploadService;
//# sourceMappingURL=upload-pgr-doc.service.js.map