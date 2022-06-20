import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentEntity } from '../../entities/environment.entity';
interface ICompanyEnvironment extends Omit<UpsertEnvironmentDto, 'photos'> {
    companyId: string;
    workspaceId: string;
}
export declare class EnvironmentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ id, companyId, workspaceId, hierarchyIds, ...environmentDto }: ICompanyEnvironment): Promise<EnvironmentEntity>;
    findAll(companyId: string, workspaceId: string, options?: Prisma.CompanyEnvironmentFindManyArgs): Promise<EnvironmentEntity[]>;
    findById(id: string): Promise<EnvironmentEntity>;
    delete(id: string, companyId: string, workspaceId: string): Promise<EnvironmentEntity>;
}
export {};
