import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CidDto, FindCidDto } from '../../dto/cid.dto';
import { CidEntity } from '../../entities/cid.entity';
export declare class CidRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsertMany(cidsDto: CidDto[]): Promise<CidEntity[]>;
    find(query: Partial<FindCidDto>, pagination: PaginationQueryDto, options?: Prisma.CidFindManyArgs): Promise<{
        data: CidEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.CidFindManyArgs): Promise<CidEntity[]>;
    findFirstNude(options?: Prisma.CidFindFirstArgs): Promise<CidEntity>;
}
