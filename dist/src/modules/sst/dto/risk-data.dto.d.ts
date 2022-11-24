import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { HomoTypeEnum, Prisma } from '@prisma/client';
import { EpiRoRiskDataDto } from './epi-risk-data.dto';
import { EngsRiskDataDto } from './engs-risk-data.dto';
import { ExamsRiskDataDto } from './exams-risk-data.dto';
export declare class UpsertRiskDataDto {
    id?: string;
    level?: number;
    workspaceId?: string;
    type?: HomoTypeEnum;
    probability?: number;
    probabilityAfter?: number;
    standardExams?: boolean;
    companyId: string;
    riskId: string;
    hierarchyId?: string;
    homogeneousGroupId: string;
    riskFactorGroupDataId: string;
    recs?: string[];
    adms?: string[];
    generateSources?: string[];
    epis?: EpiRoRiskDataDto[];
    engs?: EngsRiskDataDto[];
    exams?: ExamsRiskDataDto[];
    keepEmpty?: boolean;
    json?: Prisma.JsonValue;
    startDate?: Date;
    endDate?: Date;
}
export declare class UpsertManyRiskDataDto {
    id?: string;
    type?: HomoTypeEnum;
    level?: number;
    workspaceId?: string;
    workspaceIds?: string;
    probability?: number;
    probabilityAfter?: number;
    standardExams?: boolean;
    companyId: string;
    riskId: string;
    riskIds: string[];
    hierarchyIds: string[];
    homogeneousGroupIds: string[];
    riskFactorGroupDataId: string;
    recs?: string[];
    adms?: string[];
    generateSources?: string[];
    epis?: EpiRoRiskDataDto[];
    engs?: EngsRiskDataDto[];
    exams?: ExamsRiskDataDto[];
    json?: Prisma.JsonValue;
    startDate?: Date;
    endDate?: Date;
}
export declare class DeleteManyRiskDataDto {
    ids: string[];
}
export declare class FindRiskDataDto extends PaginationQueryDto {
    search?: string;
}
