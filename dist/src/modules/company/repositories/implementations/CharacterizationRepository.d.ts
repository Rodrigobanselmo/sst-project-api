import { CharacterizationTypeEnum, HomoTypeEnum, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertCharacterizationDto } from '../../dto/characterization.dto';
import { CharacterizationEntity } from '../../entities/characterization.entity';
interface ICompanyCharacterization extends Omit<UpsertCharacterizationDto, 'photos'> {
    companyId: string;
    workspaceId: string;
}
export declare const isEnvironment: (type: CharacterizationTypeEnum) => boolean;
export declare const getCharacterizationType: (type: CharacterizationTypeEnum) => HomoTypeEnum;
export declare class CharacterizationRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ id, companyId, workspaceId, hierarchyIds, type, profileParentId, startDate, endDate, ...characterizationDto }: ICompanyCharacterization, isProfile?: boolean): Promise<CharacterizationEntity>;
    find(companyId: string, workspaceId: string, options?: Prisma.CompanyCharacterizationFindManyArgs): Promise<CharacterizationEntity[]>;
    findAll(companyId: string, workspaceId: string, options?: Prisma.CompanyCharacterizationFindManyArgs): Promise<CharacterizationEntity[]>;
    findById(id: string, options?: Partial<Prisma.CompanyCharacterizationFindUniqueArgs & {
        getRiskData: boolean;
    }>): Promise<CharacterizationEntity>;
    delete(id: string, companyId: string, workspaceId: string): Promise<CharacterizationEntity>;
    private getHierarchiesAndRisks;
}
export {};
