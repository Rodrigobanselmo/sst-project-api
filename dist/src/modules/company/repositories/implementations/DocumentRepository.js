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
exports.DocumentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const document_entity_1 = require("../../entities/document.entity");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
let DocumentRepository = class DocumentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var createCompanyDto = __rest(_a, []);
        const document = await this.prisma.document.create({
            data: createCompanyDto,
        });
        return new document_entity_1.DocumentEntity(document);
    }
    async update(_a) {
        var { id, companyId } = _a, createCompanyDto = __rest(_a, ["id", "companyId"]);
        const document = await this.prisma.document.update({
            data: createCompanyDto,
            where: { id_companyId: { companyId, id } },
        });
        return new document_entity_1.DocumentEntity(document);
    }
    async find(query, pagination, options = {}) {
        const whereInit = Object.assign({ AND: [] }, options.where);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
            });
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            this.prisma.document.count({
                where,
            }),
            this.prisma.document.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { endDate: 'asc' } })),
        ]);
        return {
            data: response[1].map((document) => new document_entity_1.DocumentEntity(document)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const documents = await this.prisma.document.findMany(Object.assign({}, options));
        return documents.map((document) => new document_entity_1.DocumentEntity(document));
    }
    async findFirstNude(options = {}) {
        const document = await this.prisma.document.findFirst(Object.assign({}, options));
        return new document_entity_1.DocumentEntity(document);
    }
    async delete(id, companyId) {
        const document = await this.prisma.document.delete({
            where: { id_companyId: { companyId, id } },
        });
        return new document_entity_1.DocumentEntity(document);
    }
};
DocumentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentRepository);
exports.DocumentRepository = DocumentRepository;
//# sourceMappingURL=DocumentRepository.js.map