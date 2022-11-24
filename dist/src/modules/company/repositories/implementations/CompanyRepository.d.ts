import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto, FindCompaniesDto } from '../../dto/create-company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { ICompanyRepository } from '../ICompanyRepository.types';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { Prisma } from '@prisma/client';
interface ICreateCompany extends CreateCompanyDto {
    companyId?: string;
}
export declare class CompanyRepository implements ICompanyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ workspace, primary_activity, secondary_activity, license, address, companyId, doctorResponsibleId, tecResponsibleId, phone, email, ...createCompanyDto }: ICreateCompany): Promise<CompanyEntity>;
    update({ secondary_activity, primary_activity, workspace, employees, users, address, companyId, doctorResponsibleId, tecResponsibleId, ...updateCompanyDto }: UpdateCompanyDto, options?: IPrismaOptions<{
        primary_activity?: boolean;
        secondary_activity?: boolean;
        workspace?: boolean;
        employees?: boolean;
        license?: boolean;
        users?: boolean;
    }>, prismaRef?: boolean): Promise<CompanyEntity | (import(".prisma/client").Company & {
        group: import(".prisma/client").CompanyGroup;
        workspace: import(".prisma/client").Workspace[];
        employees: import(".prisma/client").Employee[];
        users: import(".prisma/client").UserCompany[];
        doctorResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
        tecResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
        license: import(".prisma/client").License;
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
    })>;
    upsertMany(updateCompanyDto: UpdateCompanyDto[], options?: IPrismaOptions<{
        primary_activity?: boolean;
        secondary_activity?: boolean;
        workspace?: boolean;
        employees?: boolean;
        license?: boolean;
        users?: boolean;
    }>): Promise<CompanyEntity[]>;
    updateDisconnect({ secondary_activity, primary_activity, workspace, employees, users, address, companyId, ...updateCompanyDto }: UpdateCompanyDto): Promise<CompanyEntity>;
    findByIdAll(id: string, workspaceId: string, options?: Partial<Prisma.CompanyFindUniqueArgs>): Promise<CompanyEntity>;
    findAllRelatedByCompanyId(companyId: string | null, queryFind: FindCompaniesDto, pagination: PaginationQueryDto, options?: Partial<Prisma.CompanyFindManyArgs>): Promise<{
        data: CompanyEntity[];
        count: number;
    }>;
    findAll(query: FindCompaniesDto, pagination: PaginationQueryDto, options?: Partial<Prisma.CompanyFindManyArgs>): Promise<{
        data: CompanyEntity[];
        count: number;
    }>;
    findById(id: string, options?: Partial<Prisma.CompanyFindManyArgs>): Promise<CompanyEntity>;
    findNude(options?: Prisma.CompanyFindManyArgs): Promise<CompanyEntity[]>;
    findFirstNude(options?: Prisma.CompanyFindFirstArgs): Promise<CompanyEntity>;
    countRelations(id: string, options?: {
        riskGroupCount?: boolean;
        hierarchyCount?: boolean;
        homogenousGroupCount?: boolean;
    }): Promise<{
        riskGroupCount: number;
        homogenousGroupCount: number;
        hierarchyCount: number;
    }>;
}
export {};
