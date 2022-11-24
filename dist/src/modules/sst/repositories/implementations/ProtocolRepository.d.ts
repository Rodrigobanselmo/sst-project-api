import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateProtocolDto, FindProtocolDto, UpdateProtocolDto, UpdateProtocolRiskDto } from '../../dto/protocol.dto';
import { ProtocolEntity } from '../../entities/protocol.entity';
export declare class ProtocolRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateProtocolDto): Promise<ProtocolEntity>;
    update({ id, companyId, ...createCompanyDto }: UpdateProtocolDto): Promise<ProtocolEntity>;
    updateProtocolRiskREMOVE({ companyId, protocolIds, riskIds }: UpdateProtocolRiskDto): Promise<ProtocolEntity[]>;
    find(query: Partial<FindProtocolDto>, pagination: PaginationQueryDto, options?: Prisma.ProtocolFindManyArgs): Promise<{
        data: ProtocolEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.ProtocolFindManyArgs): Promise<ProtocolEntity[]>;
    findFirstNude(options?: Prisma.ProtocolFindFirstArgs): Promise<ProtocolEntity>;
    deleteSoft(id: number): Promise<ProtocolEntity>;
}
