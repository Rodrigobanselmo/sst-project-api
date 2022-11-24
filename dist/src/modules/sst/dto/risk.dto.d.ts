import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { RiskCreateGenerateSourceDto, RiskUpdateGenerateSourceDto, UpsertGenerateSourceDto } from './generate-source.dto';
import { RiskCreateRecMedDto, RiskUpdateRecMedDto, UpsertRecMedDto } from './rec-med.dto';
export declare class CreateRiskDto {
    type: RiskFactorsEnum;
    name: string;
    severity: number;
    status?: StatusEnum;
    companyId: string;
    isEmergency: boolean;
    risk: string;
    esocialCode: string;
    symptoms: string;
    recMed?: RiskCreateRecMedDto[];
    generateSource?: RiskCreateGenerateSourceDto[];
    isAso?: boolean;
    isPGR?: boolean;
    isPCMSO?: boolean;
    isPPP?: boolean;
}
export declare class UpsertRiskDto extends CreateRiskDto {
    id: string;
    recMed?: UpsertRecMedDto[];
    generateSource?: UpsertGenerateSourceDto[];
}
export declare class UpdateRiskDto {
    id: string;
    type?: RiskFactorsEnum;
    name?: string;
    severity?: number;
    status?: StatusEnum;
    companyId: string;
    risk?: string;
    symptoms?: string;
    isEmergency?: boolean;
    recMed?: RiskUpdateRecMedDto[];
    generateSource?: RiskUpdateGenerateSourceDto[];
}
export declare class FindRiskDto extends PaginationQueryDto {
    search: string;
    companyId: string;
    representAll: boolean;
}
