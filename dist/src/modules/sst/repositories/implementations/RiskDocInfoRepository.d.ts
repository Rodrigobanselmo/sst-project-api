import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocInfoDto } from '../../dto/risk-doc-info.dto';
import { RiskDocInfoEntity } from '../../entities/riskDocInfo.entity';
export declare class RiskDocInfoRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ companyId, ...createDto }: UpsertRiskDocInfoDto): Promise<RiskDocInfoEntity>;
    findFirstNude(options?: Prisma.RiskFactorsDocInfoFindManyArgs): Promise<RiskDocInfoEntity>;
}
