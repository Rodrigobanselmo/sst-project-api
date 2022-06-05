import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocumentDto } from '../../dto/risk-document.dto';
import { RiskDocumentEntity } from '../../entities/riskDocument.entity';
export declare class RiskDocumentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ companyId, id, ...createDto }: UpsertRiskDocumentDto): Promise<RiskDocumentEntity>;
    findByRiskGroupAndCompany(riskGroupId: string, companyId: string): Promise<RiskDocumentEntity[]>;
    findById(id: string, companyId: string, options?: {
        select?: Prisma.RiskFactorGroupDataSelect;
        include?: Prisma.RiskFactorGroupDataInclude;
    }): Promise<RiskDocumentEntity>;
}
