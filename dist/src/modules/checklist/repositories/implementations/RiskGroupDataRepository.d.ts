import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { RiskFactorGroupDataEntity } from '../../entities/riskGroupData.entity';
export declare class RiskGroupDataRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ companyId, id, ...createDto }: UpsertRiskGroupDataDto): Promise<RiskFactorGroupDataEntity>;
    findAllByCompany(companyId: string): Promise<RiskFactorGroupDataEntity[]>;
    findById(id: string, companyId: string, options?: {
        select?: Prisma.RiskFactorGroupDataSelect;
        include?: Prisma.RiskFactorGroupDataInclude;
    }): Promise<RiskFactorGroupDataEntity>;
    findAllDataById(id: string, companyId: string, options?: {
        includeEmployees: boolean;
    }): Promise<RiskFactorGroupDataEntity>;
}
