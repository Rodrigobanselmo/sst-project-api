import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertCharacterizationDto } from '../../dto/characterization.dto';
import { EnvironmentEntity } from '../../entities/environment.entity';
interface ICompanyCharacterization extends Omit<UpsertCharacterizationDto, 'photos'> {
    companyId: string;
    workspaceId: string;
}
export declare class EnvironmentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ id, companyId, workspaceId, hierarchyIds, ...characterizationDto }: ICompanyCharacterization): Promise<EnvironmentEntity>;
    findAll(companyId: string, workspaceId: string, options?: Prisma.CompanyCharacterizationFindManyArgs): Promise<EnvironmentEntity[]>;
    findById(id: string, options?: Partial<Prisma.CompanyCharacterizationFindUniqueArgs & {
        getRiskData: boolean;
    }>): Promise<EnvironmentEntity>;
    delete(id: string, companyId: string, workspaceId: string): Promise<EnvironmentEntity>;
}
export {};
