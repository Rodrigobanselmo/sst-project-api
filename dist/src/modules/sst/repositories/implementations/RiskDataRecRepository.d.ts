import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDataRecDto } from '../../dto/risk-data-rec.dto';
import { RiskDataRecEntity } from '../../entities/riskDataRec.entity';
export declare class RiskDataRecRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ comment, ...upsertData }: UpsertRiskDataRecDto): Promise<RiskDataRecEntity>;
}
