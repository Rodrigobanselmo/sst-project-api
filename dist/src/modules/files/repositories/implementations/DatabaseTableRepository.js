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
exports.DatabaseTableRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const databaseTable_entity_1 = require("./../../entities/databaseTable.entity");
let DatabaseTableRepository = class DatabaseTableRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(createDatabaseTableDto, companyId, system, id) {
        delete createDatabaseTableDto.companyId;
        const database = await this.prisma.databaseTable.upsert({
            where: { id_companyId: { companyId, id: id || -1 } },
            create: Object.assign(Object.assign({}, createDatabaseTableDto), { system,
                companyId }),
            update: Object.assign(Object.assign({}, createDatabaseTableDto), { system,
                companyId }),
        });
        return new databaseTable_entity_1.DatabaseTableEntity(database);
    }
    async findByNameAndCompany(name, companyId) {
        const database = await this.prisma.databaseTable.findFirst({
            where: { name, companyId },
            include: {
                company: {
                    select: {
                        initials: true,
                        name: true,
                        fantasy: true,
                    },
                },
            },
        });
        if (!database) {
            return new databaseTable_entity_1.DatabaseTableEntity({ version: 1, updated_at: new Date() });
        }
        return new databaseTable_entity_1.DatabaseTableEntity(database);
    }
};
DatabaseTableRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DatabaseTableRepository);
exports.DatabaseTableRepository = DatabaseTableRepository;
//# sourceMappingURL=DatabaseTableRepository.js.map