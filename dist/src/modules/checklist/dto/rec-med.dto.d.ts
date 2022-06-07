import { MeasuresTypeEnum, StatusEnum } from '@prisma/client';
export declare class CreateRecMedDto {
    riskId: string;
    recName?: string;
    medName?: string;
    medType: MeasuresTypeEnum;
    status?: StatusEnum;
    companyId: string;
}
export declare class UpsertRecMedDto extends CreateRecMedDto {
    id: string;
}
export declare class UpdateRecMedDto {
    recName?: string;
    medName?: string;
    medType: MeasuresTypeEnum;
    status?: StatusEnum;
    companyId: string;
}
export declare class RiskCreateRecMedDto {
    recName?: string;
    medName?: string;
    medType: MeasuresTypeEnum;
    status?: StatusEnum;
}
declare const RiskUpdateRecMedDto_base: import("@nestjs/common").Type<Partial<RiskCreateRecMedDto>>;
export declare class RiskUpdateRecMedDto extends RiskUpdateRecMedDto_base {
    medType: MeasuresTypeEnum;
    id: string;
}
export {};
