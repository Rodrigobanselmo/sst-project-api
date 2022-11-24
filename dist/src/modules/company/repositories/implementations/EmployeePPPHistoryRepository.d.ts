import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { EmployeePPPHistoryEntity } from '../../entities/employee-ppp-history.entity';
export declare class EmployeePPPHistoryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createManyNude(createData: Prisma.EmployeePPPHistoryCreateArgs['data'][], options?: Partial<Prisma.EmployeePPPHistoryCreateArgs>): Promise<EmployeePPPHistoryEntity[]>;
    upsertManyNude(createData: Pick<Prisma.EmployeePPPHistoryUpsertArgs, 'create' | 'update' | 'where'>[], options?: Partial<Prisma.EmployeePPPHistoryUpsertArgs>): Promise<EmployeePPPHistoryEntity[]>;
    findNude(options?: Prisma.EmployeePPPHistoryFindManyArgs): Promise<EmployeePPPHistoryEntity[]>;
    updateManyNude(options: Prisma.EmployeePPPHistoryUpdateManyArgs): Promise<Prisma.BatchPayload>;
    findFirstNude(options?: Prisma.EmployeePPPHistoryFindFirstArgs): Promise<EmployeePPPHistoryEntity>;
}
