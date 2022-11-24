import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocumentDto } from '../../dto/risk-document.dto';
import { RiskDocumentEntity } from '../../entities/riskDocument.entity';
import { FindDocVersionDto } from '../../dto/doc-version.dto';
export declare class RiskDocumentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ companyId, attachments, ...createDto }: UpsertRiskDocumentDto): Promise<RiskDocumentEntity>;
    findByRiskGroupAndCompany(riskGroupId: string, companyId: string): Promise<RiskDocumentEntity[]>;
    find(query: Partial<FindDocVersionDto & {
        companyId: string;
    }>, pagination: PaginationQueryDto, options?: Prisma.RiskFactorDocumentFindManyArgs): Promise<{
        data: RiskDocumentEntity[];
        count: number;
    }>;
    findById(id: string, companyId: string, options?: {
        select?: Prisma.RiskFactorDocumentSelect;
        include?: Prisma.RiskFactorDocumentInclude;
    }): Promise<RiskDocumentEntity>;
}
