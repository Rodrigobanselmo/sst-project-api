import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { CreateRiskDto, FindRiskDto, UpdateRiskDto, UpsertRiskDto } from '../../dto/risk.dto';
import { RiskFactorsEntity } from '../../entities/risk.entity';
import { IRiskRepository } from '../IRiskRepository.types';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
export declare class RiskRepository implements IRiskRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ recMed, generateSource, ...createRiskDto }: CreateRiskDto, system: boolean): Promise<RiskFactorsEntity>;
    update({ recMed, generateSource, id, ...createRiskDto }: UpdateRiskDto & {
        isAso?: boolean;
        isPGR?: boolean;
        isPCMSO?: boolean;
        isPPP?: boolean;
    }, system: boolean, companyId: string): Promise<RiskFactorsEntity>;
    upsert({ companyId: _, id, recMed, generateSource, ...upsertRiskDto }: UpsertRiskDto, system: boolean, companyId: string): Promise<RiskFactorsEntity>;
    upsertMany(upsertRiskDtoMany: UpsertRiskDto[], system: boolean, companyId: string): Promise<RiskFactorsEntity[]>;
    find(query: Partial<FindRiskDto>, pagination: PaginationQueryDto, options?: Prisma.RiskFactorsFindManyArgs): Promise<{
        data: RiskFactorsEntity[];
        count: number;
    }>;
    findById(id: string, companyId: string, options?: IPrismaOptions<{
        company?: boolean;
        recMed?: boolean;
        generateSource?: boolean;
    }>): Promise<RiskFactorsEntity>;
    findAllByCompanyId(companyId: string, options?: IPrismaOptions<{
        company?: boolean;
        recMed?: boolean;
        generateSource?: boolean;
    }>): Promise<RiskFactorsEntity[]>;
    findNude(options?: Prisma.RiskFactorsFindManyArgs): Promise<RiskFactorsEntity[]>;
    findRiskDataByHierarchies(hierarchyIds: string[], companyId: string, options?: Prisma.RiskFactorsFindManyArgs & {
        date?: Date;
    }): Promise<RiskFactorsEntity[]>;
    findCountNude(pagination: PaginationQueryDto, options?: Prisma.RiskFactorsFindManyArgs): Promise<{
        data: RiskFactorsEntity[];
        count: number;
    }>;
    findAllAvailable(userCompanyId: string, { representAll, ...options }?: {
        select?: Prisma.RiskFactorsSelect;
        include?: Prisma.RiskFactorsInclude;
        representAll?: boolean;
    }): Promise<RiskFactorsEntity[]>;
    DeleteByIdSoft(id: string): Promise<RiskFactorsEntity>;
    DeleteByCompanyAndIdSoft(id: string, companyId: string): Promise<RiskFactorsEntity>;
}
