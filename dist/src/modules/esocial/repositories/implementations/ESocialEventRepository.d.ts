import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FindESocialEventDto } from '../../dto/esocial-event.dto';
import { EmployeeESocialEventEntity } from '../../entities/employeeEsocialEvent.entity';
export declare class ESocialEventRepository {
    private prisma;
    constructor(prisma: PrismaService);
    find(query: Partial<FindESocialEventDto>, pagination: PaginationQueryDto, options?: Prisma.EmployeeESocialEventFindManyArgs): Promise<{
        data: EmployeeESocialEventEntity[];
        count: number;
    }>;
    updateNude(options: Prisma.EmployeeESocialEventUpdateArgs): Promise<EmployeeESocialEventEntity>;
    findFirstNude(options: Prisma.EmployeeESocialEventFindFirstArgs): Promise<EmployeeESocialEventEntity>;
    updateManyNude(options: Prisma.EmployeeESocialEventUpdateManyArgs): Promise<void>;
}
