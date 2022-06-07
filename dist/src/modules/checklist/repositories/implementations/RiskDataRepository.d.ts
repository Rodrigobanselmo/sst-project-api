import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertManyRiskDataDto, UpsertRiskDataDto } from '../../dto/risk-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
export declare class RiskDataRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert(upsertRiskDataDto: UpsertRiskDataDto): Promise<RiskFactorDataEntity>;
    upsertMany(upsertManyRiskDataDto: UpsertManyRiskDataDto): Promise<RiskFactorDataEntity[]>;
    findAllByGroup(riskFactorGroupDataId: string, companyId?: string): Promise<RiskFactorDataEntity[]>;
    findAllByGroupAndRisk(riskFactorGroupDataId: string, riskId: string, companyId: string): Promise<RiskFactorDataEntity[]>;
    deleteById(id: string): Promise<RiskFactorDataEntity>;
    deleteByIds(ids: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    private upsertPrisma;
}
