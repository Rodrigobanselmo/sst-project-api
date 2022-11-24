import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateESocialBatch, FindESocialBatchDto } from '../../dto/esocial-batch.dto';
import { EmployeeESocialBatchEntity } from '../../entities/employeeEsocialBatch.entity';
import { Prisma } from '@prisma/client';
export declare class ESocialBatchRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ companyId, events, environment, status, type, examsIds, pppJson, ...rest }: CreateESocialBatch): Promise<EmployeeESocialBatchEntity>;
    findNude(options?: Prisma.EmployeeESocialBatchFindManyArgs): Promise<EmployeeESocialBatchEntity[]>;
    find(query: Partial<FindESocialBatchDto>, pagination: PaginationQueryDto, options?: Prisma.EmployeeESocialBatchFindManyArgs): Promise<{
        data: EmployeeESocialBatchEntity[];
        count: number;
    }>;
    updateNude(options: Prisma.EmployeeESocialBatchUpdateArgs): Promise<EmployeeESocialBatchEntity>;
}
