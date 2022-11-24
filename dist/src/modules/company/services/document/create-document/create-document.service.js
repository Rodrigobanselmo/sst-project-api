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
exports.CreateDocumentService = void 0;
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const AmazonStorageProvider_1 = require("./../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const common_1 = require("@nestjs/common");
const DocumentRepository_1 = require("../../../repositories/implementations/DocumentRepository");
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
let CreateDocumentService = class CreateDocumentService {
    constructor(documentRepository, amazonStorageProvider) {
        this.documentRepository = documentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(_a, user, file) {
        var { parentDocumentId } = _a, dto = __rest(_a, ["parentDocumentId"]);
        const companyId = user.targetCompanyId;
        if (parentDocumentId) {
            const documentFound = await this.documentRepository.findFirstNude({
                where: {
                    id: parentDocumentId,
                    companyId,
                },
            });
            if (!(documentFound === null || documentFound === void 0 ? void 0 : documentFound.id))
                throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.DOCUMENT_NOT_FOUND);
            const isNew = dto.endDate ? (0, dayjs_1.default)(documentFound.endDate).isBefore(dto.endDate) : false;
            const oldData = {
                companyId: user.targetCompanyId,
                fileUrl: documentFound.fileUrl,
                endDate: documentFound.endDate,
                startDate: documentFound.startDate,
                type: documentFound.type,
                name: documentFound.name,
                workspaceId: documentFound.workspaceId,
                status: documentFound.status,
                description: documentFound.description,
                parentDocumentId: documentFound.id,
            };
            if (isNew) {
                await this.documentRepository.create(oldData);
                let url;
                if (file)
                    url = await this.upload(companyId, file, dto);
                const document = await this.documentRepository.update(Object.assign(Object.assign({}, dto), { companyId: user.targetCompanyId, fileUrl: url, id: documentFound.id }));
                return document;
            }
            if (!isNew) {
                let url;
                if (file)
                    url = await this.upload(companyId, file, dto);
                const document = await this.documentRepository.create(Object.assign(Object.assign({}, dto), { companyId: user.targetCompanyId, fileUrl: url, parentDocumentId: documentFound.id }));
                return document;
            }
        }
        let url;
        if (file)
            url = await this.upload(companyId, file, dto);
        const document = await this.documentRepository.create(Object.assign(Object.assign({}, dto), { companyId: user.targetCompanyId, fileUrl: url }));
        return document;
    }
    async upload(companyId, file, dto) {
        const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
        const path = companyId + '/documents/' + `${(dto === null || dto === void 0 ? void 0 : dto.name) || ''}-${(0, uuid_1.v4)()}` + '.' + fileType;
        const { url } = await this.amazonStorageProvider.upload({
            file: file.buffer,
            fileName: path,
        });
        return url;
    }
};
CreateDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DocumentRepository_1.DocumentRepository, AmazonStorageProvider_1.AmazonStorageProvider])
], CreateDocumentService);
exports.CreateDocumentService = CreateDocumentService;
//# sourceMappingURL=create-document.service.js.map