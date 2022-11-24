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
exports.UpsertDocumentPCMSOService = void 0;
const common_1 = require("@nestjs/common");
const DocumentPCMSORepository_1 = require("../../../repositories/implementations/DocumentPCMSORepository");
let UpsertDocumentPCMSOService = class UpsertDocumentPCMSOService {
    constructor(documentPCMSORepository) {
        this.documentPCMSORepository = documentPCMSORepository;
    }
    async execute(dto) {
        const riskData = await this.documentPCMSORepository.upsert(dto);
        return riskData;
    }
};
UpsertDocumentPCMSOService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DocumentPCMSORepository_1.DocumentPCMSORepository])
], UpsertDocumentPCMSOService);
exports.UpsertDocumentPCMSOService = UpsertDocumentPCMSOService;
//# sourceMappingURL=upsert-document-pcmso.service.js.map