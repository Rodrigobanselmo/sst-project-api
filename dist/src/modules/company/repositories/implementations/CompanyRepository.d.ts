import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { ICompanyRepository } from '../ICompanyRepository.types';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
interface ICreateCompany extends CreateCompanyDto {
    companyId?: string;
}
export declare class CompanyRepository implements ICompanyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ workspace, primary_activity, secondary_activity, license, address, companyId, ...createCompanyDto }: ICreateCompany): Promise<CompanyEntity>;
    update({ secondary_activity, primary_activity, workspace, employees, users, address, companyId, ...updateCompanyDto }: UpdateCompanyDto, options?: IPrismaOptions<{
        primary_activity?: boolean;
        secondary_activity?: boolean;
        workspace?: boolean;
        employees?: boolean;
        license?: boolean;
        users?: boolean;
    }>, prismaRef?: boolean): Promise<CompanyEntity | (import(".prisma/client").Company & {
        workspace: import(".prisma/client").Workspace[];
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
        license: import(".prisma/client").License;
        users: import(".prisma/client").UserCompany[];
        employees: import(".prisma/client").Employee[];
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
    findById(id: string, options?: IPrismaOptions<{
        primary_activity?: boolean;
        secondary_activity?: boolean;
        workspace?: boolean;
        employees?: boolean;
    }>): Promise<CompanyEntity>;
    findAllRelatedByCompanyId(companyId: string, options?: IPrismaOptions<{
        primary_activity?: boolean;
        secondary_activity?: boolean;
    }>): Promise<CompanyEntity[]>;
    findAll(options?: IPrismaOptions<{
        primary_activity?: boolean;
        secondary_activity?: boolean;
    }>): Promise<CompanyEntity[]>;
}
export {};
