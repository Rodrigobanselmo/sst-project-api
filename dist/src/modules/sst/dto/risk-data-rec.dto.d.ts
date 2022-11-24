import { RiskRecTextTypeEnum, RiskRecTypeEnum, StatusEnum } from '@prisma/client';
export declare class CreateRiskDataRecDto {
    text: string;
    type: RiskRecTypeEnum;
    textType: RiskRecTextTypeEnum;
}
export declare class UpsertRiskDataRecDto {
    id?: string;
    responsibleName?: string;
    endDate?: Date;
    status?: StatusEnum;
    riskFactorDataId: string;
    recMedId: string;
    companyId: string;
    comment?: CreateRiskDataRecDto;
}
