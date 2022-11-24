import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateProtocolToRiskDto, FindProtocolToRiskDto, UpdateProtocolToRiskDto, UpsertManyProtocolToRiskDto } from '../../dto/protocol-to-risk.dto';
import { ProtocolToRiskEntity } from '../../entities/protocol.entity';
export declare class ProtocolToRiskRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ ...createProtocolToRiskDto }: CreateProtocolToRiskDto): Promise<ProtocolToRiskEntity>;
    update({ id, companyId, ...createProtocolToRiskDto }: UpdateProtocolToRiskDto): Promise<ProtocolToRiskEntity>;
    find(query: Partial<FindProtocolToRiskDto>, pagination: PaginationQueryDto, options?: Prisma.ProtocolToRiskFindManyArgs): Promise<{
        data: ProtocolToRiskEntity[];
        count: number;
    }>;
    createMany({ companyId, data }: UpsertManyProtocolToRiskDto): Promise<void>;
    upsertMany({ companyId, data }: UpsertManyProtocolToRiskDto): Promise<ProtocolToRiskEntity[]>;
    findNude(options?: Prisma.ProtocolToRiskFindManyArgs): Promise<ProtocolToRiskEntity[]>;
}
