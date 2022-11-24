import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { FindRiskDataDto, UpsertManyRiskDataDto, UpsertRiskDataDto } from '../../dto/risk-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
import { Prisma } from '@prisma/client';
export declare class RiskDataRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert(upsertRiskDataDto: Omit<UpsertRiskDataDto, 'keepEmpty' | 'type'>): Promise<RiskFactorDataEntity>;
    upsertConnectMany(upsertManyRiskDataDto: UpsertManyRiskDataDto): Promise<RiskFactorDataEntity[]>;
    upsertMany(upsertManyRiskDataDto: UpsertManyRiskDataDto): Promise<RiskFactorDataEntity[]>;
    findAllByGroup(riskFactorGroupDataId: string, companyId?: string): Promise<RiskFactorDataEntity[]>;
    findAllByGroupAndRisk(riskFactorGroupDataId: string, riskId: string, companyId: string): Promise<RiskFactorDataEntity[]>;
    findAllActionPlan(riskFactorGroupDataId: string, workspaceId: string, companyId: string, query: Partial<FindRiskDataDto>, pagination: PaginationQueryDto): Promise<{
        data: RiskFactorDataEntity[];
        count: number;
    }>;
    findAllByHomogeneousGroupId(companyId: string, riskFactorGroupDataId: string, homogeneousGroupId: string): Promise<RiskFactorDataEntity[]>;
    findAllByHierarchyId(companyId: string, hierarchyId: string, options?: Prisma.RiskFactorDataFindManyArgs): Promise<RiskFactorDataEntity[]>;
    findNude(options?: Prisma.RiskFactorDataFindManyArgs): Promise<RiskFactorDataEntity[]>;
    deleteById(id: string): Promise<RiskFactorDataEntity>;
    deleteByIds(ids: string[]): Promise<Prisma.BatchPayload>;
    deleteByIdsAndCompany(ids: string[], companyId: string): Promise<Prisma.BatchPayload>;
    deleteByHomoAndRisk(homogeneousGroupIds: string[], riskIds: string[], groupId: string): Promise<Prisma.BatchPayload>;
    private upsertPrisma;
    private upsertConnectPrisma;
    private setEpis;
    private setExams;
    private setEngs;
    private addLevel;
}
