import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { EmployeeEntity } from '../../entities/employee.entity';
export declare class EmployeeRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ workplaceId, hierarchyId, companyId, ...createCompanyDto }: CreateEmployeeDto): Promise<EmployeeEntity>;
    update({ workplaceId, hierarchyId, companyId, id, ...createCompanyDto }: UpdateEmployeeDto): Promise<EmployeeEntity>;
    upsertMany(upsertEmployeeMany: (CreateEmployeeDto & {
        id: number;
    })[], companyId: string): Promise<EmployeeEntity[]>;
    findById(id: number, companyId: string, options?: IPrismaOptions<{
        hierarchy?: boolean;
        company?: string;
    }>): Promise<EmployeeEntity>;
    findAllByCompany(companyId: string, options?: IPrismaOptions<{
        hierarchy?: boolean;
    }>): Promise<EmployeeEntity[]>;
}
