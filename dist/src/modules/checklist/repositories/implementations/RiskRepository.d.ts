import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { CreateRiskDto, UpdateRiskDto, UpsertRiskDto } from '../../dto/risk.dto';
import { RiskFactorsEntity } from '../../entities/risk.entity';
import { IRiskRepository } from '../IRiskRepository.types';
export declare class RiskRepository implements IRiskRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ recMed, generateSource, ...createRiskDto }: CreateRiskDto, system: boolean): Promise<RiskFactorsEntity>;
    update({ recMed, generateSource, id, ...createRiskDto }: UpdateRiskDto, system: boolean, companyId: string): Promise<RiskFactorsEntity>;
    upsert({ companyId: _, id, recMed, generateSource, ...upsertRiskDto }: UpsertRiskDto, system: boolean, companyId: string): Promise<RiskFactorsEntity>;
    upsertMany(upsertRiskDtoMany: UpsertRiskDto[], system: boolean, companyId: string): Promise<RiskFactorsEntity[]>;
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
    findAllAvailable(companyId: string, userCompanyId: string, { representAll, ...options }?: {
        select?: Prisma.RiskFactorsSelect;
        include?: Prisma.RiskFactorsInclude;
        representAll?: boolean;
    }): Promise<RiskFactorsEntity[]>;
    DeleteByIdSoft(id: string): Promise<RiskFactorsEntity>;
    DeleteByCompanyAndIdSoft(id: string, companyId: string): Promise<RiskFactorsEntity>;
}
