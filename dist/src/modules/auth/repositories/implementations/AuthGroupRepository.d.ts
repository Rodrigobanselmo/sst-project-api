import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { FindAccessGroupDto, UpsertAccessGroupDto } from '../../dto/access-group.dto';
import { AccessGroupsEntity } from '../../entities/access-groups.entity';
export declare class AuthGroupRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ id, companyId, ...data }: UpsertAccessGroupDto, system: boolean): Promise<AccessGroupsEntity>;
    findById(id: number, companyId: string, options?: Prisma.AccessGroupsFindFirstArgs): Promise<AccessGroupsEntity>;
    findAvailable(companyId: string, query: Partial<FindAccessGroupDto>, pagination: PaginationQueryDto, options?: Prisma.AccessGroupsFindManyArgs): Promise<{
        data: AccessGroupsEntity[];
        count: number;
    }>;
}
