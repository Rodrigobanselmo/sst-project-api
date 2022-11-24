import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateEmployeeHierarchyHistoryDto, FindEmployeeHierarchyHistoryDto, UpdateEmployeeHierarchyHistoryDto } from '../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryEntity } from '../../entities/employee-hierarchy-history.entity';
export declare class EmployeeHierarchyHistoryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ subOfficeId, ...createData }: CreateEmployeeHierarchyHistoryDto, employeeId: number, hierarchyId?: string | null): Promise<EmployeeHierarchyHistoryEntity>;
    update({ id, subOfficeId, ...updateData }: UpdateEmployeeHierarchyHistoryDto, employeeId: number, hierarchyId?: string | null): Promise<EmployeeHierarchyHistoryEntity>;
    find(query: Partial<FindEmployeeHierarchyHistoryDto>, pagination: PaginationQueryDto, options?: Prisma.EmployeeHierarchyHistoryFindManyArgs): Promise<{
        data: EmployeeHierarchyHistoryEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.EmployeeHierarchyHistoryFindManyArgs): Promise<EmployeeHierarchyHistoryEntity[]>;
    findFirstNude(options?: Prisma.EmployeeHierarchyHistoryFindFirstArgs): Promise<EmployeeHierarchyHistoryEntity>;
    delete(id: number, employeeId: number, hierarchyId?: string | null): Promise<EmployeeHierarchyHistoryEntity>;
}
