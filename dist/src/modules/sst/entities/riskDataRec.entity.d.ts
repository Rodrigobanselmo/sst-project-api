import { RiskFactorDataRec, StatusEnum } from '@prisma/client';
import { RiskDataRecCommentsEntity } from './riskDataRecComments.entity';
export declare class RiskDataRecEntity implements RiskFactorDataRec {
    id: string;
    responsibleName: string;
    endDate: Date;
    comment: string;
    status: StatusEnum;
    recMedId: string;
    companyId: string;
    riskFactorDataId: string;
    comments?: RiskDataRecCommentsEntity[];
    updated_at: Date;
    created_at: Date;
    constructor(partial: Partial<RiskDataRecEntity>);
}
