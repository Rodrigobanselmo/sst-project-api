import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateEmployeeDto, FindEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { EmployeeEntity } from '../../entities/employee.entity';
import { FindEvents2220Dto } from './../../../esocial/dto/event.dto';
export declare class EmployeeRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ workspaceIds, hierarchyId, companyId, shiftId, cidId, ...createCompanyDto }: CreateEmployeeDto): Promise<EmployeeEntity>;
    update({ workspaceIds, hierarchyId, companyId, shiftId, cidId, id, ...createCompanyDto }: UpdateEmployeeDto, removeSubOffices?: boolean): Promise<EmployeeEntity>;
    updateNude(options: Prisma.EmployeeUpdateArgs): Promise<EmployeeEntity>;
    upsertMany(upsertEmployeeMany: (CreateEmployeeDto & {
        id: number;
        admissionDate?: Date;
    })[], companyId: string): Promise<EmployeeEntity[]>;
    findById(id: number, companyId: string, options?: Prisma.EmployeeFindManyArgs): Promise<EmployeeEntity>;
    find(query: Partial<FindEmployeeDto>, pagination: PaginationQueryDto, options?: Prisma.EmployeeFindManyArgs): Promise<{
        data: EmployeeEntity[];
        count: number;
    }>;
    findEvent2220(query: FindEvents2220Dto & {
        startDate: Date;
    }, pagination: PaginationQueryDto, options?: Prisma.EmployeeFindManyArgs): Promise<{
        data: EmployeeEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.EmployeeFindManyArgs): Promise<EmployeeEntity[]>;
    countNude(options?: Prisma.EmployeeCountArgs): Promise<number>;
    findOnlyCountNude(options?: Prisma.EmployeeFindManyArgs): Promise<number>;
    findCountNude(options: Prisma.EmployeeFindManyArgs, pagination: PaginationQueryDto): Promise<{
        data: EmployeeEntity[];
        count: number;
    }>;
    findFirstNude(options?: Prisma.EmployeeFindFirstArgs): Promise<EmployeeEntity>;
    disconnectSubOffices(employeesIds: number[], companyId: string): Promise<EmployeeEntity[]>;
    disconnectUniqueSubOffice(employeeId: number, subOfficeId: string, companyId: string): Promise<EmployeeEntity>;
    private parentInclude;
}
