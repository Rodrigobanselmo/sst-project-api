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
exports.PgrUploadService = exports.getRiskDoc = exports.checkRiskDataDoc = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const removeDuplicate_1 = require("../../../../../shared/utils/removeDuplicate");
const uuid_1 = require("uuid");
const CompanyRepository_1 = require("../../../../company/repositories/implementations/CompanyRepository");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const downloadImageFile_1 = require("../../../../../shared/utils/downloadImageFile");
const riskDocument_entity_1 = require("../../../../sst/entities/riskDocument.entity");
const RiskDocumentRepository_1 = require("../../../../sst/repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("../../../../sst/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const ProfessionalRepository_1 = require("../../../../users/repositories/implementations/ProfessionalRepository");
const document_1 = require("../../../docx/base/config/document");
const create_1 = require("../../../docx/builders/pgr/create");
const getFileName_1 = require("../../../../../shared/utils/getFileName");
const attachment_entity_1 = require("../../../../sst/entities/attachment.entity");
const WorkspaceRepository_1 = require("../../../../company/repositories/implementations/WorkspaceRepository");
const actionPlan_section_1 = require("../../../docx/components/tables/actionPlan/actionPlan.section");
const appr_section_1 = require("../../../docx/components/tables/appr/appr.section");
const appr_group_section_1 = require("../../../docx/components/tables/apprByGroup/appr-group.section");
const hierarchy_converter_1 = require("../../../docx/converter/hierarchy.converter");
const checkRiskDataDoc = (riskData, { companyId, docType }) => {
    return riskData.filter((riskData) => {
        const foundHierarchyDoc = riskData.riskFactor.docInfo.find((doc) => doc.hierarchyId == riskData.homogeneousGroupId);
        if (foundHierarchyDoc)
            return foundHierarchyDoc[docType];
        const isChecked = riskData.riskFactor.docInfo.find((riskData) => riskData.hierarchyId && riskData[docType]);
        const docInfo = (0, exports.getRiskDoc)(riskData.riskFactor, { companyId });
        if (docInfo[docType] || isChecked)
            return true;
        return false;
    });
};
exports.checkRiskDataDoc = checkRiskDataDoc;
const getRiskDoc = (risk, { companyId, hierarchyId }) => {
    var _a, _b, _c;
    if (hierarchyId) {
        const data = (_a = risk === null || risk === void 0 ? void 0 : risk.docInfo) === null || _a === void 0 ? void 0 : _a.find((i) => i.hierarchyId && i.hierarchyId == hierarchyId);
        if (data)
            return data;
    }
    if (companyId) {
        const first = (_b = risk === null || risk === void 0 ? void 0 : risk.docInfo) === null || _b === void 0 ? void 0 : _b.find((i) => !i.hierarchyId && i.companyId === companyId);
        if (first)
            return first;
    }
    const second = (_c = risk === null || risk === void 0 ? void 0 : risk.docInfo) === null || _c === void 0 ? void 0 : _c.find((i) => !i.hierarchyId);
    if (second)
        return second;
    return risk;
};
exports.getRiskDoc = getRiskDoc;
let PgrUploadService = class PgrUploadService {
    constructor(riskGroupDataRepository, riskDocumentRepository, workspaceRepository, companyRepository, amazonStorageProvider, hierarchyRepository, professionalRepository, dayJSProvider) {
        this.riskGroupDataRepository = riskGroupDataRepository;
        this.riskDocumentRepository = riskDocumentRepository;
        this.workspaceRepository = workspaceRepository;
        this.companyRepository = companyRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.hierarchyRepository = hierarchyRepository;
        this.professionalRepository = professionalRepository;
        this.dayJSProvider = dayJSProvider;
        this.attachments_remove = [];
        this.getFileName = (upsertPgrDto, riskGroupData, typeName = 'PGR') => {
            var _a;
            return (0, getFileName_1.getDocxFileName)({
                name: upsertPgrDto.name,
                companyName: (((_a = riskGroupData.company) === null || _a === void 0 ? void 0 : _a.fantasy) || riskGroupData.company.name) + (riskGroupData.company.initials ? '-' + riskGroupData.company.initials : ''),
                version: upsertPgrDto.version,
                typeName,
                date: (0, DayJSProvider_1.dayjs)(riskGroupData.documentDate || new Date()).format('MMMM-YYYY'),
            });
        };
    }
    async execute(upsertPgrDto) {
        var _a, _b;
        this.attachments_remove = [];
        const companyId = upsertPgrDto.companyId;
        const workspaceId = upsertPgrDto.workspaceId;
        const fromDate = new Date();
        console.log('start: query data');
        const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, workspaceId, companyId);
        const hierarchyHierarchy = (await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId)).map((hierarchy) => {
            var _a;
            return (Object.assign(Object.assign({}, hierarchy), { employees: [
                    ...hierarchy.employees,
                    ...(_a = hierarchy.subOfficeEmployees) === null || _a === void 0 ? void 0 : _a.map((employee) => {
                        var _a;
                        return (_a = employee === null || employee === void 0 ? void 0 : employee.subOffices) === null || _a === void 0 ? void 0 : _a.map((subOffice) => (Object.assign({ hierarchyId: subOffice.id }, employee)));
                    }).reduce((acc, curr) => [...acc, ...curr], []),
                ] }));
        });
        const versions = (await this.riskDocumentRepository.findByRiskGroupAndCompany(upsertPgrDto.riskGroupId, companyId)).filter((riskDocument) => riskDocument.version.includes('.0.0'));
        const workspace = await this.workspaceRepository.findById(workspaceId);
        const company = await this.companyRepository.findByIdAll(companyId, workspaceId, {
            include: {
                primary_activity: true,
                address: true,
                covers: true,
                environments: {
                    include: {
                        photos: true,
                        homogeneousGroup: {
                            include: { riskFactorData: { include: { riskFactor: true } } },
                        },
                    },
                    where: { workspaceId },
                },
                characterization: {
                    include: {
                        photos: true,
                        profiles: true,
                        homogeneousGroup: {
                            include: { riskFactorData: { include: { riskFactor: true } } },
                        },
                    },
                    where: { workspaceId },
                },
                receivingServiceContracts: {
                    include: {
                        applyingServiceCompany: {
                            include: { address: true, covers: true },
                        },
                    },
                },
            },
        });
        riskGroupData.data = riskGroupData.data.filter((riskData) => {
            if (riskData.homogeneousGroup.type == client_1.HomoTypeEnum.HIERARCHY) {
                const foundHierarchyDoc = riskData.riskFactor.docInfo.find((doc) => doc.hierarchyId == riskData.homogeneousGroupId);
                if (foundHierarchyDoc)
                    return foundHierarchyDoc.isPGR;
            }
            const isHierarchyPgr = riskData.riskFactor.docInfo.find((riskData) => riskData.hierarchyId && riskData.isPGR);
            const docInfo = (0, exports.getRiskDoc)(riskData.riskFactor, { companyId });
            if (docInfo.isPGR || isHierarchyPgr)
                return true;
            return false;
        });
        const getConsultant = () => {
            var _a, _b, _c;
            if (((_a = company.receivingServiceContracts) === null || _a === void 0 ? void 0 : _a.length) == 1) {
                return (_b = company.receivingServiceContracts[0]) === null || _b === void 0 ? void 0 : _b.applyingServiceCompany;
            }
            if (((_c = company.receivingServiceContracts) === null || _c === void 0 ? void 0 : _c.length) > 1) {
                return;
            }
        };
        const consultant = getConsultant();
        const consultantLogo = consultant ? await (0, downloadImageFile_1.downloadImageFile)(consultant === null || consultant === void 0 ? void 0 : consultant.logoUrl, `tmp/${(0, uuid_1.v4)()}.${(0, downloadImageFile_1.getExtensionFromUrl)(consultant === null || consultant === void 0 ? void 0 : consultant.logoUrl)}`) : '';
        const logo = company.logoUrl ? await (0, downloadImageFile_1.downloadImageFile)(company.logoUrl, `tmp/${(0, uuid_1.v4)()}.${(0, downloadImageFile_1.getExtensionFromUrl)(company.logoUrl)}`) : '';
        const cover = ((_a = company === null || company === void 0 ? void 0 : company.covers) === null || _a === void 0 ? void 0 : _a[0]) || ((_b = consultant === null || consultant === void 0 ? void 0 : consultant.covers) === null || _b === void 0 ? void 0 : _b[0]);
        console.log('start: photos');
        const { environments, characterizations, photosPath } = await this.downloadPhotos(company);
        console.log('end: photos');
        try {
            const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree } = (0, hierarchy_converter_1.hierarchyConverter)(hierarchyHierarchy, environments, { workspaceId });
            console.log('start: attachment');
            const { actionPlanUrl, urlAPR, urlGroupAPR } = await this.generateAttachment(riskGroupData, hierarchyData, hierarchyHighLevelsData, hierarchyTree, homoGroupTree, upsertPgrDto);
            const version = new riskDocument_entity_1.RiskDocumentEntity({
                version: upsertPgrDto.version,
                description: upsertPgrDto.description,
                validity: riskGroupData.validity,
                approvedBy: riskGroupData.approvedBy,
                revisionBy: riskGroupData.revisionBy,
                created_at: new Date(),
            });
            versions.unshift(version);
            const docId = upsertPgrDto.id || (0, uuid_1.v4)();
            const actionPlanName = 'Plano de Ação Detalhado';
            const attachments = [
                new attachment_entity_1.AttachmentEntity({
                    id: (0, uuid_1.v4)(),
                    name: 'Inventário de Risco por Função (APR)',
                    url: urlAPR,
                }),
                new attachment_entity_1.AttachmentEntity({
                    id: (0, uuid_1.v4)(),
                    name: 'Inventário de Risco por GSE (APR)',
                    url: urlGroupAPR,
                }),
                new attachment_entity_1.AttachmentEntity({
                    id: (0, uuid_1.v4)(),
                    name: actionPlanName,
                    url: actionPlanUrl,
                }),
            ];
            const versionString = `${this.dayJSProvider.format(version.created_at)} - REV. ${version.version}`;
            console.log('start: build document');
            const sections = new create_1.DocumentBuildPGR({
                version: versionString,
                document: riskGroupData,
                attachments: attachments.map((attachment) => {
                    if (actionPlanName === attachment.name) {
                        return Object.assign(Object.assign({}, attachment), { url: `${process.env.APP_HOST}/dashboard/empresas/${companyId}/${workspaceId}/plano-de-acao/${riskGroupData.id}` });
                    }
                    return Object.assign(Object.assign({}, attachment), { url: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${attachment.id}&ref3=${companyId}` });
                }),
                logo,
                consultantLogo,
                company,
                workspace,
                versions,
                environments,
                hierarchy: hierarchyData,
                homogeneousGroup: homoGroupTree,
                characterizations,
                hierarchyTree,
                cover,
            }).build();
            console.log('end: build document part 1');
            const doc = (0, document_1.createBaseDocument)(sections);
            console.log('end: build document part 2');
            const b64string = await docx_1.Packer.toBase64String(doc);
            const buffer = Buffer.from(b64string, 'base64');
            console.log('end: build document part 3');
            const fileName = this.getFileName(upsertPgrDto, riskGroupData);
            const url = await this.upload(buffer, fileName, upsertPgrDto);
            await this.riskDocumentRepository.upsert({
                id: docId,
                companyId: company.id,
                fileUrl: url,
                status: client_1.StatusEnum.DONE,
                attachments: attachments,
                name: upsertPgrDto.name,
                version: upsertPgrDto.version,
                riskGroupId: upsertPgrDto.riskGroupId,
                description: upsertPgrDto.description,
                workspaceId: upsertPgrDto.workspaceId,
                workspaceName: upsertPgrDto.workspaceName,
            });
            this.unlinkFiles([logo, consultantLogo, ...photosPath]);
            console.log('done: unlink photos');
            return { buffer, fileName };
        }
        catch (error) {
            this.unlinkFiles([logo, consultantLogo, ...photosPath]);
            console.log('error: unlink photos', error);
            if (upsertPgrDto.id)
                await this.riskDocumentRepository.upsert({
                    id: upsertPgrDto.id,
                    companyId: company.id,
                    name: upsertPgrDto.name,
                    version: upsertPgrDto.version,
                    riskGroupId: upsertPgrDto.riskGroupId,
                    description: upsertPgrDto.description,
                    workspaceId: upsertPgrDto.workspaceId,
                    workspaceName: upsertPgrDto.workspaceName,
                    status: client_1.StatusEnum.ERROR,
                });
            throw error;
        }
    }
    async upload(fileBuffer, fileName, upsertPgrDto) {
        const { url } = await this.amazonStorageProvider.upload({
            file: fileBuffer,
            fileName: 'temp-files-7-days/' + fileName,
        });
        return url;
    }
    async downloadPhotos(company) {
        const photosPath = [];
        try {
            const environments = await Promise.all(company.environments.map(async (environment) => {
                const photos = (await Promise.all(environment.photos.map(async (photo) => {
                    try {
                        const path = await (0, downloadImageFile_1.downloadImageFile)(photo.photoUrl, `tmp/${(0, uuid_1.v4)()}.${(0, downloadImageFile_1.getExtensionFromUrl)(photo.photoUrl)}`);
                        if (path)
                            photosPath.push(path);
                        return Object.assign(Object.assign({}, photo), { photoUrl: path });
                    }
                    catch (error) {
                        return Object.assign(Object.assign({}, photo), { photoUrl: null });
                    }
                }))).filter((photo) => photo.photoUrl);
                return Object.assign(Object.assign({}, environment), { photos });
            }));
            const characterizations = await Promise.all(company.characterization.map(async (environment) => {
                const photos = (await Promise.all(environment.photos.map(async (photo) => {
                    try {
                        const path = await (0, downloadImageFile_1.downloadImageFile)(photo.photoUrl, `tmp/${(0, uuid_1.v4)()}.${(0, downloadImageFile_1.getExtensionFromUrl)(photo.photoUrl)}`);
                        if (path)
                            photosPath.push(path);
                        return Object.assign(Object.assign({}, photo), { photoUrl: path });
                    }
                    catch (error) {
                        return Object.assign(Object.assign({}, photo), { photoUrl: null });
                    }
                }))).filter((photo) => photo.photoUrl);
                return Object.assign(Object.assign({}, environment), { photos });
            }));
            const allChar = (0, removeDuplicate_1.removeDuplicate)([...characterizations, ...environments], {
                removeById: 'id',
            });
            return {
                environments: allChar,
                characterizations: allChar,
                photosPath,
            };
        }
        catch (error) {
            console.log('unlink photo on error');
            this.unlinkFiles(photosPath);
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async generateAttachment(riskGroupData, hierarchyData, hierarchyHighLevelsData, hierarchyTree, homoGroupTree, upsertPgrDto) {
        const aprSection = [...(0, appr_section_1.APPRTableSection)(riskGroupData, hierarchyData, homoGroupTree)];
        const urlAPR = await this.save(riskGroupData, upsertPgrDto, aprSection, 'PGR-APR');
        const aprGroupSection = [...(0, appr_group_section_1.APPRByGroupTableSection)(riskGroupData, hierarchyHighLevelsData, hierarchyTree, homoGroupTree)];
        const urlGroupAPR = await this.save(riskGroupData, upsertPgrDto, aprGroupSection, 'PGR-APR-GSE');
        const actionPlanSections = [(0, actionPlan_section_1.actionPlanTableSection)(riskGroupData, hierarchyTree)];
        const actionPlanUrl = await this.save(riskGroupData, upsertPgrDto, actionPlanSections, 'PGR-PLANO_DE_ACAO');
        return { urlAPR, urlGroupAPR, actionPlanUrl };
    }
    async save(riskGroupData, upsertPgrDto, sections, text) {
        const Doc = (0, document_1.createBaseDocument)(sections);
        const b64string = await docx_1.Packer.toBase64String(Doc);
        const buffer = Buffer.from(b64string, 'base64');
        this.attachments_remove.push(buffer);
        const fileName = this.getFileName(upsertPgrDto, riskGroupData, text);
        const url = await this.upload(buffer, fileName, upsertPgrDto);
        return url;
    }
    async unlinkFiles(paths) {
        paths
            .filter((i) => !!i && typeof i == 'string')
            .forEach((path) => {
            try {
                console.log('paths', path);
                fs_1.default.unlinkSync(path);
            }
            catch (e) { }
        });
    }
};
PgrUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskGroupDataRepository_1.RiskGroupDataRepository,
        RiskDocumentRepository_1.RiskDocumentRepository,
        WorkspaceRepository_1.WorkspaceRepository,
        CompanyRepository_1.CompanyRepository,
        AmazonStorageProvider_1.AmazonStorageProvider,
        HierarchyRepository_1.HierarchyRepository,
        ProfessionalRepository_1.ProfessionalRepository,
        DayJSProvider_1.DayJSProvider])
], PgrUploadService);
exports.PgrUploadService = PgrUploadService;
//# sourceMappingURL=upload-pgr-doc.service.js.map