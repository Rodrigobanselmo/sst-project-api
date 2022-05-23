import { StatusEnum } from '@prisma/client';
import { RiskCreateRecMedDto, RiskUpdateRecMedDto } from './rec-med.dto';
export declare class CreateGenerateSourceDto {
    riskId: string;
    name: string;
    status?: StatusEnum;
    companyId: string;
    recMeds?: RiskCreateRecMedDto[];
}
export declare class UpsertGenerateSourceDto extends CreateGenerateSourceDto {
    id: string;
}
export declare class UpdateGenerateSourceDto {
    name: string;
    status?: StatusEnum;
    companyId: string;
    recMeds?: RiskUpdateRecMedDto[];
}
export declare class RiskCreateGenerateSourceDto {
    name: string;
    status?: StatusEnum;
}
export declare class RiskUpdateGenerateSourceDto extends RiskCreateGenerateSourceDto {
    id: string;
}
