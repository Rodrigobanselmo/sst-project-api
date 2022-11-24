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
exports.DocumentPCMSORepository = void 0;
const common_1 = require("@nestjs/common");
const m2mFilterIds_1 = require("./../../../../shared/utils/m2mFilterIds");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const CharacterizationRepository_1 = require("../../../company/repositories/implementations/CharacterizationRepository");
const documentPCMSO_entity_1 = require("../../entities/documentPCMSO.entity");
let DocumentPCMSORepository = class DocumentPCMSORepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var _b;
        var { companyId, id, professionals } = _a, createDto = __rest(_a, ["companyId", "id", "professionals"]);
        const documentPCMSO = await this.prisma.documentPCMSO.upsert({
            create: Object.assign(Object.assign({}, createDto), { companyId }),
            update: Object.assign(Object.assign({}, createDto), { companyId }),
            where: { id_companyId: { companyId, id: id || 'not-found' } },
            include: {
                professionalsSignatures: !!professionals,
            },
        });
        if (professionals) {
            if ((_b = documentPCMSO.professionalsSignatures) === null || _b === void 0 ? void 0 : _b.length) {
                await this.prisma.documentPCMSOToProfessional.deleteMany({
                    where: {
                        professionalId: {
                            in: (0, m2mFilterIds_1.m2mGetDeletedIds)(documentPCMSO.professionalsSignatures, professionals, 'professionalId'),
                        },
                        documentPCMSOId: documentPCMSO.id,
                    },
                });
            }
            documentPCMSO.professionalsSignatures = await this.setProfessionalsSignatures(professionals.map((user) => (Object.assign(Object.assign({}, user), { documentPCMSOId: documentPCMSO.id }))));
        }
        return new documentPCMSO_entity_1.DocumentPCMSOEntity(documentPCMSO);
    }
    async findAllByCompany(companyId) {
        const docs = await this.prisma.documentPCMSO.findMany({
            where: { companyId },
        });
        return docs.map((data) => new documentPCMSO_entity_1.DocumentPCMSOEntity(data));
    }
    async findById(companyId, options = {}) {
        const doc = await this.prisma.documentPCMSO.findUnique(Object.assign({ where: { companyId } }, options));
        return new documentPCMSO_entity_1.DocumentPCMSOEntity(doc);
    }
    async findAllDataById(id, workspaceId, companyId, options = {}) {
        const docPCMSO = await this.prisma.documentPCMSO.findUnique({
            where: { id_companyId: { id, companyId } },
            include: {
                company: {
                    include: {
                        riskFactorData: {
                            where: {
                                homogeneousGroup: {
                                    hierarchyOnHomogeneous: {
                                        some: {
                                            OR: [
                                                { workspaceId: workspaceId },
                                                {
                                                    hierarchy: {
                                                        workspaces: {
                                                            some: { id: workspaceId },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                            include: {
                                adms: true,
                                recs: true,
                                generateSources: true,
                                epiToRiskFactorData: { include: { epi: true } },
                                engsToRiskFactorData: { include: { recMed: true } },
                                riskFactor: {
                                    include: {
                                        docInfo: {
                                            where: {
                                                OR: [
                                                    { companyId },
                                                    {
                                                        company: {
                                                            applyingServiceContracts: {
                                                                some: { receivingServiceCompanyId: companyId },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                                dataRecs: true,
                                hierarchy: {
                                    include: { employees: { select: { _count: true } } },
                                },
                                homogeneousGroup: {
                                    include: { characterization: true, environment: true },
                                },
                            },
                        },
                    },
                },
                professionalsSignatures: {
                    include: { professional: { include: { professional: true } } },
                },
            },
        });
        docPCMSO.company.riskFactorData.map((data, index) => {
            if (data.homogeneousGroup.characterization && (0, CharacterizationRepository_1.isEnvironment)(data.homogeneousGroup.characterization.type)) {
                docPCMSO.company.riskFactorData[index].homogeneousGroup.environment = data.homogeneousGroup.characterization;
                docPCMSO.company.riskFactorData[index].homogeneousGroup.characterization = data.homogeneousGroup.characterization = null;
            }
        });
        return new documentPCMSO_entity_1.DocumentPCMSOEntity(docPCMSO);
    }
    async setProfessionalsSignatures(professionalsSignatures) {
        if (professionalsSignatures.length === 0)
            return [];
        const data = await this.prisma.$transaction(professionalsSignatures.map((_a) => {
            var { professional, professionalId, documentPCMSOId } = _a, rest = __rest(_a, ["professional", "professionalId", "documentPCMSOId"]);
            return this.prisma.documentPCMSOToProfessional.upsert({
                create: Object.assign({ documentPCMSOId, professionalId }, rest),
                update: Object.assign({ documentPCMSOId, professionalId }, rest),
                where: {
                    documentPCMSOId_professionalId: {
                        documentPCMSOId,
                        professionalId,
                    },
                },
                include: { professional: true },
            });
        }));
        return data;
    }
};
DocumentPCMSORepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentPCMSORepository);
exports.DocumentPCMSORepository = DocumentPCMSORepository;
//# sourceMappingURL=DocumentPCMSORepository.js.map