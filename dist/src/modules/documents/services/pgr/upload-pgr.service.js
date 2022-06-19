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
const common_1 = require("@nestjs/common");
const docx_1 = require("docx");
const stream_1 = require("stream");
const RiskDocumentRepository_1 = require("../../../../modules/checklist/repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("../../../../modules/company/repositories/implementations/HierarchyRepository");
const AmazonStorageProvider_1 = require("../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const hierarchy_converter_1 = require("../../utils/sections/converter/hierarchy.converter");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const downloadImageFile_1 = require("../../../../shared/utils/downloadImageFile");
let PgrUploadService = class PgrUploadService {
    constructor(riskGroupDataRepository, riskDocumentRepository, amazonStorageProvider, hierarchyRepository) {
        this.riskGroupDataRepository = riskGroupDataRepository;
        this.riskDocumentRepository = riskDocumentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(upsertPgrDto, userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        const workspaceId = upsertPgrDto.workspaceId;
        const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, companyId);
        const hierarchyHierarchy = await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId);
        const { hierarchyData, homoGroupTree } = (0, hierarchy_converter_1.hierarchyConverter)(hierarchyHierarchy);
        const url = 'https://prod-simplesst-docs.s3.amazonaws.com/b8635456-334e-4d6e-ac43-cfe5663aee17/environment/dcf93c91-815a-4b12-8a68-a6f39d86711b.png';
        const example_image_1 = await (0, downloadImageFile_1.downloadImageFile)(url, `tmp/${(0, uuid_1.v4)()}.${(0, downloadImageFile_1.getExtensionFromUrl)(url)}`);
        console.log(example_image_1);
        const image = new docx_1.ImageRun({
            data: fs_1.default.readFileSync(example_image_1),
            transformation: {
                width: 600,
                height: 338,
            },
        });
        const chapter1 = new docx_1.Paragraph({
            heading: docx_1.HeadingLevel.TITLE,
            children: [
                new docx_1.Bookmark({
                    id: 'anchorForChapter1',
                    children: [new docx_1.TextRun('Chapter 1')],
                }),
            ],
        });
        const internalHyperlink = new docx_1.Paragraph({
            children: [
                new docx_1.InternalHyperlink({
                    children: [
                        new docx_1.TextRun({
                            text: 'See Chapter 1',
                        }),
                    ],
                    anchor: 'anchorForChapter1',
                }),
                new docx_1.TextRun('Chapter 1 can be seen on page '),
                new docx_1.PageReference('anchorForChapter1'),
            ],
        });
        const doc = new docx_1.Document({
            features: {
                updateFields: true,
            },
            styles: {
                paragraphStyles: [
                    {
                        id: 'TableHeader',
                        name: 'Table Header Styles',
                        quickFormat: true,
                        link: '',
                        run: {
                            italics: true,
                            color: 'ff0000',
                            bold: true,
                        },
                    },
                ],
            },
            sections: [
                {
                    children: [
                        new docx_1.TableOfContents('Summary', {
                            hyperlink: true,
                            headingStyleRange: '1-3',
                        }),
                    ],
                },
                {
                    children: [internalHyperlink],
                },
                {
                    children: [
                        new docx_1.TableOfContents('Tables', {
                            hyperlink: true,
                            entriesFromBookmark: '[anchorForChapter1]',
                        }),
                    ],
                },
                {
                    children: [
                        new docx_1.Paragraph({
                            text: 'Header #1',
                            heading: docx_1.HeadingLevel.HEADING_1,
                            pageBreakBefore: true,
                        }),
                        new docx_1.Paragraph({
                            text: 'Header #2',
                            heading: docx_1.HeadingLevel.HEADING_2,
                        }),
                        new docx_1.Paragraph({
                            text: 'Header #3',
                            heading: docx_1.HeadingLevel.HEADING_3,
                        }),
                        new docx_1.Paragraph({
                            text: 'Header #4',
                            heading: docx_1.HeadingLevel.HEADING_4,
                        }),
                        new docx_1.Paragraph({
                            heading: docx_1.HeadingLevel.HEADING_5,
                            text: 'HEADING_5',
                        }),
                        new docx_1.Paragraph({
                            text: 'HEADING_6',
                            heading: docx_1.HeadingLevel.HEADING_6,
                        }),
                        new docx_1.Paragraph({
                            heading: docx_1.HeadingLevel.HEADING_5,
                            text: 'HEADING_5 again',
                        }),
                        new docx_1.Paragraph({
                            text: 'TableHeader',
                            style: 'TableHeader',
                            pageBreakBefore: true,
                        }),
                        chapter1,
                    ],
                },
            ],
        });
        fs_1.default.unlinkSync(example_image_1);
        const b64string = await docx_1.Packer.toBase64String(doc);
        const buffer = Buffer.from(b64string, 'base64');
        const docName = upsertPgrDto.name.replace(/\s+/g, '');
        const fileName = `${docName.length > 0 ? docName + '-' : ''}${riskGroupData.company.name.replace(/\s+/g, '')}-v${upsertPgrDto.version}.docx`;
        await this.upload(buffer, fileName, upsertPgrDto, riskGroupData.company);
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
//# sourceMappingURL=upload-pgr.service.js.map