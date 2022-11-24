import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ActivityDto, FindActivityDto } from '../../dto/activity.dto';
import { ActivityEntity } from '../../entities/activity.entity';
import { Prisma } from '@prisma/client';
export declare class ActivityRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<ActivityEntity[]>;
    upsertMany(activitiesDto: ActivityDto[]): Promise<ActivityEntity[]>;
    find(query: Partial<FindActivityDto>, pagination: PaginationQueryDto, options?: Prisma.ActivityFindManyArgs): Promise<{
        data: ActivityEntity[];
        count: number;
    }>;
}
