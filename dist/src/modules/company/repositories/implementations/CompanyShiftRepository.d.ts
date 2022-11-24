import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateCompanyShiftDto, FindCompanyShiftDto, UpdateCompanyShiftDto } from '../../dto/company-shift.dto';
import { CompanyShiftEntity } from '../../entities/company-shift.entity';
export declare class CompanyShiftRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createData: CreateCompanyShiftDto): Promise<CompanyShiftEntity>;
    update({ id, companyId, ...updateData }: UpdateCompanyShiftDto): Promise<CompanyShiftEntity>;
    find(query: Partial<FindCompanyShiftDto>, pagination: PaginationQueryDto, options?: Prisma.CompanyShiftFindManyArgs): Promise<{
        data: CompanyShiftEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.CompanyShiftFindManyArgs): Promise<CompanyShiftEntity[]>;
    findFirstNude(options?: Prisma.CompanyShiftFindFirstArgs): Promise<CompanyShiftEntity>;
    delete(id: number): Promise<CompanyShiftEntity>;
}
