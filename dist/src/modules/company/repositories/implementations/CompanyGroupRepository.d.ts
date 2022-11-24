import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { FindCompanyGroupDto, UpsertCompanyGroupDto } from '../../dto/company-group.dto';
import { CompanyGroupEntity } from '../../entities/company-group.entity';
export declare class CompanyGroupRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ id, companyId, companiesIds, doctorResponsibleId, tecResponsibleId, ...data }: UpsertCompanyGroupDto): Promise<CompanyGroupEntity>;
    findById(id: number, companyId: string, options?: Prisma.CompanyGroupFindFirstArgs): Promise<CompanyGroupEntity>;
    findAvailable(companyId: string, query: Partial<FindCompanyGroupDto>, pagination: PaginationQueryDto, options?: Prisma.CompanyGroupFindManyArgs): Promise<{
        data: CompanyGroupEntity[];
        count: number;
    }>;
}
