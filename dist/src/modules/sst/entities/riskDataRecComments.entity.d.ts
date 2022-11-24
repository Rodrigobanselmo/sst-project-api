import { RiskFactorDataRecComments, RiskRecTextTypeEnum, RiskRecTypeEnum } from '@prisma/client';
export declare class RiskDataRecCommentsEntity implements RiskFactorDataRecComments {
    id: string;
    text: string;
    type: RiskRecTypeEnum;
    textType: RiskRecTextTypeEnum;
    riskFactorDataRecId: string;
    updated_at: Date;
    created_at: Date;
    constructor(partial: Partial<RiskDataRecCommentsEntity>);
}
