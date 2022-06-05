import { RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { RiskCreateGenerateSourceDto, RiskUpdateGenerateSourceDto, UpsertGenerateSourceDto } from './generate-source.dto';
import { RiskCreateRecMedDto, RiskUpdateRecMedDto, UpsertRecMedDto } from './rec-med.dto';
export declare class CreateRiskDto {
    type: RiskFactorsEnum;
    name: string;
    severity: number;
    status?: StatusEnum;
    companyId: string;
    recMed?: RiskCreateRecMedDto[];
    generateSource?: RiskCreateGenerateSourceDto[];
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
    status?: StatusEnum;
    companyId: string;
    recMed?: RiskUpdateRecMedDto[];
    generateSource?: RiskUpdateGenerateSourceDto[];
}
