import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { FindCompanyClinicDto, SetCompanyClinicDto } from '../../dto/company-clinic.dto';
import { CompanyClinicsEntity } from '../../entities/company-clinics.entity';
export declare class CompanyClinicRepository {
    private prisma;
    constructor(prisma: PrismaService);
    set(createCompanyDto: SetCompanyClinicDto, companyId: string): Promise<void>;
    findAllByCompany(query: Partial<FindCompanyClinicDto>, pagination: PaginationQueryDto, options?: Prisma.CompanyClinicsFindManyArgs): Promise<{
        data: CompanyClinicsEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.CompanyClinicsFindManyArgs): Promise<CompanyClinicsEntity[]>;
    findFirstNude(options?: Prisma.CompanyClinicsFindManyArgs): Promise<CompanyClinicsEntity>;
    delete(clinicId: string, companyId: string): Promise<CompanyClinicsEntity>;
}
