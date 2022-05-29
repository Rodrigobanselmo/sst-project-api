import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDataDto } from '../../dto/risk-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
export declare class RiskDataRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ recs, adms, engs, epis, generateSources, companyId, id, ...createDto }: UpsertRiskDataDto): Promise<RiskFactorDataEntity>;
    findAllByGroup(riskFactorGroupDataId: string, companyId?: string): Promise<RiskFactorDataEntity[]>;
    findAllByGroupAndRisk(riskFactorGroupDataId: string, riskId: string, companyId: string): Promise<RiskFactorDataEntity[]>;
}
